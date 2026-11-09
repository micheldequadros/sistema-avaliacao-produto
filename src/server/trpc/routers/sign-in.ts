import "server-only";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/features/auth/sign-in/schema";
import { createSession } from "@/server/auth/session";
import { getSupabase } from "@/server/db/supabase";
import { publicProcedure } from "../init";

// Hash bcrypt (cost 10) de uma senha aleatória descartada. Quando o email não
// existe, comparamos contra ele para que o tempo de resposta não revele quais
// emails têm conta.
const DUMMY_HASH =
  "$2b$10$/iWWWKmvhKZ8QLbZiWy5QOaKSP5K88aJae/2teoA42db7K56UuzJW";

const INVALID_CREDENTIALS = "Email ou senha inválidos.";

export const signInProcedure = publicProcedure
  .input(signInSchema)
  .mutation(async ({ input }) => {
    const { data: account, error } = await getSupabase()
      .from("accounts")
      .select("id, password, active")
      .eq("email", input.email)
      .maybeSingle();

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Não foi possível entrar.",
        cause: error,
      });
    }

    const passwordMatches = await bcrypt.compare(
      input.password,
      account?.password ?? DUMMY_HASH,
    );

    // Mesma mensagem para email inexistente, senha errada e conta inativa.
    if (!account || !account.active || !passwordMatches) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: INVALID_CREDENTIALS,
      });
    }

    await createSession(account.id);
    return { id: account.id };
  });
