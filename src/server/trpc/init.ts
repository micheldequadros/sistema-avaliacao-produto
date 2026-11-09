import "server-only";
import { initTRPC } from "@trpc/server";
import { ZodError, z } from "zod";

const t = initTRPC.create({
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
