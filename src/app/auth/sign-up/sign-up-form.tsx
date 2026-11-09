"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CircleAlert, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ComponentProps, useId } from "react";
import { type FieldError, useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type SignUpData,
  type SignUpInput,
  signUpSchema,
} from "@/features/auth/sign-up/schema";
import { useTRPC } from "@/lib/trpc/client";

const FIELDS = [
  "firstName",
  "lastName",
  "email",
  "password",
  "confirmPassword",
] as const;

const API_ERRORS: Record<number, string> = {
  400: "Revise os campos marcados em vermelho.",
  409: "Este email já tem uma conta. Use outro email para continuar.",
};
const FALLBACK_ERROR =
  "Não conseguimos criar a conta agora. Tente de novo em alguns minutos.";

export function SignUpForm() {
  const router = useRouter();
  const trpc = useTRPC();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<SignUpInput, unknown, SignUpData>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
  });

  const signUp = useMutation(
    trpc["sign-up"].mutationOptions({
      onSuccess: () => {
        reset();
        router.push("/auth/sign-up/success");
      },
      onError: (error) => {
        if (error.data?.httpStatus === 409) {
          // O alerta explica; aqui só destacamos o campo a corrigir.
          setError(
            "email",
            { type: "conflict", message: "" },
            { shouldFocus: true },
          );
          return;
        }
        const fieldErrors = error.data?.fieldErrors;
        if (fieldErrors) {
          for (const field of FIELDS) {
            const message = fieldErrors[field]?.[0];
            if (message) setError(field, { message });
          }
        }
      },
    }),
  );

  const apiError = signUp.error
    ? (API_ERRORS[signUp.error.data?.httpStatus ?? 0] ?? FALLBACK_ERROR)
    : null;

  const onSubmit = handleSubmit((data) => signUp.mutate(data));

  return (
    <section className="grid gap-8">
      <header className="grid gap-2">
        <h2 className="text-[1.95rem] leading-tight font-semibold tracking-tight [font-stretch:88%]">
          Crie sua conta
        </h2>
        <p className="text-muted-foreground">
          Use seu email de trabalho para começar.
        </p>
      </header>

      <form onSubmit={onSubmit} noValidate className="grid gap-5">
        {apiError && (
          <Alert
            variant="destructive"
            role="alert"
            className="border-destructive/30 bg-destructive/5 px-3 py-2.5"
          >
            <CircleAlert aria-hidden />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <div className="grid items-start gap-5 sm:grid-cols-2">
          <Field
            label="Primeiro nome"
            autoComplete="given-name"
            error={errors.firstName}
            {...register("firstName")}
          />
          <Field
            label="Sobrenome"
            autoComplete="family-name"
            error={errors.lastName}
            {...register("lastName")}
          />
        </div>

        <Field
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@empresa.com"
          error={errors.email}
          {...register("email")}
        />

        <div className="grid items-start gap-5 sm:grid-cols-2">
          <Field
            label="Senha"
            type="password"
            autoComplete="new-password"
            hint="8 ou mais caracteres, com letras e números."
            error={errors.password}
            {...register("password")}
          />
          <Field
            label="Confirme a senha"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </div>

        <Button
          type="submit"
          disabled={signUp.isPending}
          className="mt-1 h-12 w-full rounded-lg text-base font-semibold"
        >
          {signUp.isPending && <Loader2 className="animate-spin" aria-hidden />}
          {signUp.isPending ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </section>
  );
}

type FieldProps = ComponentProps<typeof Input> & {
  label: string;
  hint?: string;
  error?: FieldError;
};

function Field({ label, hint, error, ...inputProps }: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error?.message || hint;

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className="h-11 bg-card px-3 text-base md:text-base"
        {...inputProps}
      />
      {message && (
        <p
          id={messageId}
          className={
            error ? "text-sm text-destructive" : "text-sm text-muted-foreground"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}
