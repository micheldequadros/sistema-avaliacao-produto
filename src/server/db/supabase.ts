import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let client: SupabaseClient<Database> | undefined;

/** Client Supabase com service role — uso exclusivo no servidor. */
export function getSupabase(): SupabaseClient<Database> {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar definidas (veja .env.example).",
    );
  }

  client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
