import { cn } from "cn";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

/** Bloco para quem não está logado: ler é público, avaliar exige conta. */
export function SignInPrompt({ productId }: { productId: string }) {
  const next = encodeURIComponent(`/products/${productId}`);

  return (
    <div className="grid gap-5 rounded-2xl border border-primary/45 bg-primary/[0.04] p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-7">
      <div className="grid gap-1.5">
        <p className="text-lg font-semibold tracking-tight">
          Entre para avaliar este produto
        </p>
        <p className="max-w-[46ch] text-sm text-muted-foreground">
          Qualquer pessoa pode ler as avaliações. Para publicar a sua, entre na
          sua conta.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-5">
        <Link
          href={`/auth/sign-in?next=${next}`}
          className={cn(
            buttonVariants(),
            "h-11 gap-2 rounded-lg px-5 text-base font-semibold",
          )}
        >
          <LogIn aria-hidden="true" />
          Entrar
        </Link>
        <Link
          href="/auth/sign-up"
          className="rounded-sm text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Criar conta
        </Link>
      </div>
    </div>
  );
}
