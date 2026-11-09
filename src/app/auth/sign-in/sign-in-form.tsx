"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { cn } from "cn";
import { CircleAlert, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ComponentProps, type ReactNode, useId, useState } from "react";
import { type FieldError, useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type SignInData,
  type SignInInput,
  safeNextPath,
  signInSchema,
} from "@/features/auth/sign-in/schema";
import { useTRPC } from "@/lib/trpc/client";

const FIELDS = ["email", "password"] as const;

const API_ERRORS: Record<number, string> = {
  400: "Revise os campos marcados em vermelho.",
  // Genérica de propósito: não diz se o erro está no email ou na senha.
  401: "Email ou senha inválidos.",
};
const FALLBACK_ERROR =
  "Não conseguimos entrar agora. Tente de novo em alguns minutos.";

export function SignInForm() {
  const router = useRouter();
  const trpc = useTRPC();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    resetField,
    setFocus,
    formState: { errors },
  } = useForm<SignInInput, unknown, SignInData>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
  });

  const signIn = useMutation(
    trpc["sign-in"].mutationOptions({
      onSuccess: () => {
        // Lido no clique (e não com useSearchParams) para o formulário
        // continuar no shell estático, sem precisar de <Suspense>.
        const next = new URLSearchParams(window.location.search).get("next");
        router.replace(safeNextPath(next));
        router.refresh();
      },
      onError: (error) => {
        if (error.data?.httpStatus === 401) {
          // Mantém o email, limpa a senha e devolve o foco para ela.
          resetField("password");
          setFocus("password");
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

  const apiError = signIn.error
    ? (API_ERRORS[signIn.error.data?.httpStatus ?? 0] ?? FALLBACK_ERROR)
    : null;

  const onSubmit = handleSubmit((data) => signIn.mutate(data));
  const isBusy = signIn.isPending || signIn.isSuccess;

  return (
    <section className="grid gap-8">
      <header className="grid gap-2">
        <h2 className="text-[1.95rem] leading-tight font-semibold tracking-tight [font-stretch:88%]">
          Entrar
        </h2>
        <p className="text-muted-foreground">
          Veja o que seus clientes estão dizendo sobre cada produto.
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

        <Field
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@empresa.com"
          error={errors.email}
          {...register("email")}
        />

        <Field
          label="Senha"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          error={errors.password}
          className="pr-11"
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {showPassword ? (
                <EyeOff className="size-4.5" aria-hidden />
              ) : (
                <Eye className="size-4.5" aria-hidden />
              )}
            </button>
          }
          {...register("password")}
        />

        <Button
          type="submit"
          disabled={isBusy}
          className="mt-1 h-12 w-full rounded-lg text-base font-semibold"
        >
          {isBusy && <Loader2 className="animate-spin" aria-hidden />}
          {isBusy ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link
          href="/auth/sign-up"
          className="rounded-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Criar conta
        </Link>
      </p>
    </section>
  );
}

type FieldProps = ComponentProps<typeof Input> & {
  label: string;
  hint?: string;
  error?: FieldError;
  /** Elemento posicionado dentro do campo, à direita (ex.: mostrar senha). */
  trailing?: ReactNode;
};

function Field({
  label,
  hint,
  error,
  trailing,
  className,
  ...inputProps
}: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error?.message || hint;

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn("h-11 bg-card px-3 text-base md:text-base", className)}
          {...inputProps}
        />
        {trailing}
      </div>
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
