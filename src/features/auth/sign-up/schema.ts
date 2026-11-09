import { z } from "zod";

/**
 * Schema compartilhado entre o formulário (cliente) e a procedure tRPC (API).
 * Senha limitada a 72 caracteres: o bcrypt ignora tudo além de 72 bytes.
 */
export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "Informe seu primeiro nome")
      .max(100, "Máximo de 100 caracteres"),
    lastName: z
      .string()
      .trim()
      .min(1, "Informe seu sobrenome")
      .max(100, "Máximo de 100 caracteres"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("Informe um email válido").max(254, "Email muito longo")),
    password: z
      .string()
      .min(8, "A senha precisa ter pelo menos 8 caracteres")
      .max(72, "A senha pode ter no máximo 72 caracteres")
      .regex(/[a-zA-Z]/, "A senha precisa conter ao menos uma letra")
      .regex(/\d/, "A senha precisa conter ao menos um número"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.input<typeof signUpSchema>;
export type SignUpData = z.output<typeof signUpSchema>;
