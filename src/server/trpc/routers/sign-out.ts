import "server-only";
import { deleteSession } from "@/server/auth/session";
import { publicProcedure } from "../init";

// POST /api/v1/sign-out: apaga o cookie de sessão. Idempotente (200 mesmo sem sessão).
export const signOutProcedure = publicProcedure.mutation(async () => {
  await deleteSession();
  return { ok: true as const };
});
