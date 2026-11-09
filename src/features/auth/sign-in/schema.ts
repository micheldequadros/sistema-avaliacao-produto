import { z } from "zod";

/**
 * Schema compartilhado entre o formulário (cliente) e a procedure tRPC (API).
 * Sem regras de força na senha: no login elas só atrapalham. O limite de 72
 * caracteres acompanha o bcrypt, que ignora o que passa de 72 bytes.
 */
export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Informe um email válido").max(254, "Email muito longo")),
  password: z
    .string()
    .min(1, "Informe sua senha")
    .max(72, "A senha pode ter no máximo 72 caracteres"),
});

export type SignInInput = z.input<typeof signInSchema>;
export type SignInData = z.output<typeof signInSchema>;

/**
 * Destino seguro para o `?next=` depois do login: só caminhos relativos que
 * começam com `/` (e não `//` nem `/\`), para evitar open redirect.
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  if (next.startsWith("/\\")) return "/";
  return next;
}
