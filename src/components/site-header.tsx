import Link from "next/link";
import { Suspense } from "react";
import { Brand } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserMenu } from "@/components/user-menu";
import { getCurrentAccount } from "@/server/auth/current-account";
import { getSession } from "@/server/auth/session";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link
          href="/"
          aria-label="Página inicial"
          className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {/* No mobile só o ícone: nome + "Entrar" + "Criar conta" não cabem. */}
          <Brand nameClassName="sr-only sm:not-sr-only" />
        </Link>

        {/* Lê o cookie de sessão: com cacheComponents precisa ficar em <Suspense>. */}
        <Suspense fallback={<AccountSkeleton />}>
          <AccountArea />
        </Suspense>
      </div>
    </header>
  );
}

async function AccountArea() {
  // `cookies()` fica fora do catch: no prerender ele rejeita de propósito e o
  // Next precisa ver essa rejeição. Só a falha do banco é tratada aqui, para
  // não derrubar a página inteira pelo cabeçalho.
  const session = await getSession();
  const account = session
    ? await getCurrentAccount().catch((error: unknown) => {
        console.error("[site-header] getCurrentAccount:", error);
        return null;
      })
    : null;

  if (!account) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/auth/sign-in"
          className={buttonVariants({
            variant: "ghost",
            className: "h-10 rounded-lg px-3 text-sm font-semibold sm:px-4",
          })}
        >
          Entrar
        </Link>
        <Link
          href="/auth/sign-up"
          className={buttonVariants({
            className: "h-10 rounded-lg px-3 text-sm font-semibold sm:px-4",
          })}
        >
          Criar conta
        </Link>
      </div>
    );
  }

  return <UserMenu account={account} />;
}

/** Mesmo tamanho do gatilho do menu da conta, para o cabeçalho não pular. */
function AccountSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-10 items-center gap-3 md:pr-2 md:pl-1"
    >
      <Skeleton className="size-9 rounded-full" />
      <div className="hidden w-36 gap-1.5 md:grid">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-36" />
      </div>
    </div>
  );
}
