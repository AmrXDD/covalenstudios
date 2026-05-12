import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { insertQuoteInquiry, type QuoteInquiryInput } from "~/lib/supabase";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

// Anyone hitting /api/quote directly in a browser gets bounced to the
// homepage's contact section instead of seeing a raw 400.
export const loader = () => redirect("/#contact");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_SERVICES = new Set(["smma", "dev", "uiux", "other"]);

export async function action({ request }: ActionFunctionArgs) {
  try {
    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, { status: 405 });
    }

    const form = await request.formData();
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const company = (String(form.get("company") ?? "").trim() || null) as string | null;
    const serviceRaw = String(form.get("service") ?? "other").trim();
    const budget = (String(form.get("budget") ?? "").trim() || null) as string | null;
    const message = String(form.get("message") ?? "").trim();
    const source = (String(form.get("source") ?? "").trim() || null) as string | null;

    const fieldErrors: FieldErrors = {};
    if (!name) fieldErrors.name = "Please share your name.";
    if (!email) fieldErrors.email = "Email is required.";
    else if (!EMAIL_RE.test(email)) fieldErrors.email = "That email looks off.";
    if (!message || message.length < 12)
      fieldErrors.message = "Tell us a little more about your project (12+ characters).";

    if (Object.keys(fieldErrors).length > 0) {
      return json({ ok: false, fieldErrors }, { status: 400 });
    }

    const service = (VALID_SERVICES.has(serviceRaw)
      ? serviceRaw
      : "other") as QuoteInquiryInput["service"];

    try {
      await insertQuoteInquiry({
        name,
        email,
        company,
        service,
        budget,
        message,
        source,
      });
    } catch (err) {
      console.error("[api.quote] supabase insert failed", err);
      const detail = err instanceof Error ? err.message : String(err);
      return json(
        {
          ok: false,
          error:
            "We couldn't save your inquiry right now. Please try again, or email us directly at sales@covalenstudios.cloud.",
          // Surfaced only in the server logs for debugging — not shown to users.
          _debug: detail,
        },
        { status: 500 },
      );
    }

    // Fire-and-forget Resend email notification — never block the user's response.
    // Dynamic import so a broken Resend module never prevents the action from loading.
    import("~/lib/resend.server")
      .then(({ sendQuoteNotification }) =>
        sendQuoteNotification({
          name,
          email,
          company,
          service,
          budget,
          message,
          source,
        }),
      )
      .catch((e) => console.error("[api.quote] resend failed", e));

    return json({ ok: true });
  } catch (err) {
    // Last-resort catch: never let an unhandled throw bubble up as
    // "Unexpected Server Error" — always return a JSON the client can render.
    console.error("[api.quote] unhandled error", err);
    const detail = err instanceof Error ? err.message : String(err);
    return json(
      {
        ok: false,
        error:
          "Something went wrong on our side. Please email sales@covalenstudios.cloud directly while we look into it.",
        _debug: detail,
      },
      { status: 500 },
    );
  }
}
