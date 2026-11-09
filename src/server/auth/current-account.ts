import "server-only";
import { cache } from "react";
import { getSupabase } from "@/server/db/supabase";
import { getSession } from "./session";

export type CurrentAccount = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

/** Conta logada (ativa), ou `null`. Deduplicada por request. */
export const getCurrentAccount = cache(
  async (): Promise<CurrentAccount | null> => {
    const session = await getSession();
    if (!session) return null;

    const { data, error } = await getSupabase()
      .from("accounts")
      .select("id, first_name, last_name, email")
      .eq("id", session.accountId)
      .eq("active", true)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
    };
  },
);
