import "server-only";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../init";

// STUB (Fase 0). Implementação: agente sign-in.
export const signInProcedure = publicProcedure.mutation(() => {
  throw new TRPCError({ code: "NOT_IMPLEMENTED", message: "Em construção." });
});
