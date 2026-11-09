import "server-only";
import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError, z } from "zod";
import type { Session } from "@/server/auth/session";

export type Context = {
  /** Headers da requisição (ex.: `x-admin-key`). */
  headers: Headers;
  session: Session | null;
};

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    const isValidationError =
      error.code === "BAD_REQUEST" && error.cause instanceof ZodError;

    return {
      ...shape,
      // Não expõe detalhes internos nem o JSON cru do Zod na mensagem.
      message: isValidationError
        ? "Dados inválidos."
        : error.code === "INTERNAL_SERVER_ERROR"
          ? "Erro interno do servidor."
          : shape.message,
      data: {
        ...shape.data,
        // Erros de validação por campo, para o formulário exibi-los.
        fieldErrors:
          isValidationError && error.cause instanceof ZodError
            ? (z.flattenError(error.cause).fieldErrors as Partial<
                Record<string, string[]>
              >)
            : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

/** Exige sessão: sem ela responde 401. `ctx.session` deixa de ser nulo. */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Você precisa estar logado.",
    });
  }
  return next({ ctx: { ...ctx, session: ctx.session } });
});
