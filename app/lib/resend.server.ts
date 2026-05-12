import { Resend } from "resend";

type QuoteEmailPayload = {
  name: string;
  email: string;
  company?: string | null;
  service: "smma" | "dev" | "uiux" | "other";
  budget?: string | null;
  message: string;
  source?: string | null;
};

const SERVICE_LABEL: Record<QuoteEmailPayload["service"], string> = {
  smma: "Social Media Marketing",
  dev: "Full-Stack Development",
  uiux: "UI / UX Design",
  other: "Other",
};

let cached: Resend | null = null;
function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendQuoteNotification(payload: QuoteEmailPayload) {
  const client = getClient();
  if (!client) {
    console.warn("[resend] RESEND_API_KEY missing — skipping email notification");
    return { skipped: true as const };
  }

  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || "CovalenStudios <onboarding@resend.dev>";
  if (!to) {
    console.warn("[resend] LEAD_NOTIFY_EMAIL missing — skipping email notification");
    return { skipped: true as const };
  }

  const serviceLabel = SERVICE_LABEL[payload.service];
  const subject = `New quote inquiry — ${payload.name} · ${serviceLabel}`;

  const rows: Array<[string, string]> = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Company", payload.company || "—"],
    ["Service", serviceLabel],
    ["Budget", payload.budget || "—"],
    ["Source", payload.source || "—"],
  ];

  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;background:#F5F1E6;padding:32px;color:#050505">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:24px;padding:28px;border:1px solid rgba(5,5,5,0.08)">
        <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#5C5C5C;margin:0 0 6px">CovalenStudios</p>
        <h1 style="font-size:22px;margin:0 0 18px;color:#050505">New quote inquiry</h1>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#2E2E2E">
          ${rows
            .map(
              ([k, v]) => `
            <tr>
              <td style="padding:8px 0;width:120px;color:#5C5C5C">${escapeHtml(k)}</td>
              <td style="padding:8px 0;color:#050505">${escapeHtml(v)}</td>
            </tr>
          `,
            )
            .join("")}
        </table>
        <div style="margin-top:20px;padding-top:18px;border-top:1px solid rgba(5,5,5,0.08)">
          <p style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#5C5C5C;margin:0 0 8px">Project brief</p>
          <p style="white-space:pre-wrap;line-height:1.6;margin:0;color:#050505">${escapeHtml(payload.message)}</p>
        </div>
        <p style="margin-top:24px;font-size:12px;color:#7A7A7A">Reply directly to ${escapeHtml(payload.email)} to follow up.</p>
      </div>
    </div>
  `;

  const text =
    `New CovalenStudios quote inquiry\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nMessage:\n${payload.message}\n`;

  const { error } = await client.emails.send({
    from,
    to,
    replyTo: payload.email,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("[resend] send failed", error);
    return { skipped: false as const, error };
  }

  return { skipped: false as const };
}
