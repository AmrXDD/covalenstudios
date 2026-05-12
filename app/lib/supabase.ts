import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser client — uses public anon key exposed via window.ENV (see app/root.tsx).
 * Safe to import in client components.
 */
let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error(
      "getSupabaseBrowser() called on the server. Use getSupabaseServer() instead.",
    );
  }
  if (browserClient) return browserClient;

  const env = (window as unknown as { ENV?: Record<string, string> }).ENV ?? {};
  const url = env.PUBLIC_SUPABASE_URL;
  const key = env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY in window.ENV",
    );
  }

  browserClient = createClient(url, key, {
    auth: { persistSession: false },
  });
  return browserClient;
}

/**
 * Server client — uses the service role key. NEVER expose this to the browser.
 * Import only from loaders / actions / .server files.
 */
export function getSupabaseServer(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/* -------------------------------------------------------------------------- */
/*  Domain types — leads / quote inquiries                                    */
/* -------------------------------------------------------------------------- */

export interface QuoteInquiryInput {
  name: string;
  email: string;
  company?: string | null;
  service: "smma" | "dev" | "uiux" | "other";
  budget?: string | null;
  message: string;
  source?: string | null;
}

export interface QuoteInquiryRow extends QuoteInquiryInput {
  id: string;
  created_at: string;
}

/**
 * Insert a new quote inquiry. Call from a server-side action.
 *
 * Expected SQL (run once in Supabase):
 *
 *   create table quote_inquiries (
 *     id uuid primary key default gen_random_uuid(),
 *     created_at timestamptz not null default now(),
 *     name text not null,
 *     email text not null,
 *     company text,
 *     service text not null,
 *     budget text,
 *     message text not null,
 *     source text
 *   );
 */
export async function insertQuoteInquiry(
  input: QuoteInquiryInput,
): Promise<QuoteInquiryRow> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("quote_inquiries")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as QuoteInquiryRow;
}
