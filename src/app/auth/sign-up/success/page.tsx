import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: `Conta criada · ${BRAND_NAME}`,
};

export default function SignUpSuccessPage() {
  return (
    <section className="grid gap-4">
      <span className="grid size-12 place-items-center rounded-full bg-verified text-white">
        <Check className="size-6" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <h2 className="mt-2 text-[1.95rem] leading-tight font-semibold tracking-tight [font-stretch:88%]">
        Conta criada
      </h2>
      <p className="text-muted-foreground">
        Sua conta está pronta. Entre com seu email e senha para avaliar os
        produtos e compartilhar sua experiência.
      </p>

      <div className="mt-4 grid gap-3">
        <Link
          href="/auth/sign-in"
          className={buttonVariants({
            className: "group h-12 w-full rounded-lg text-base font-semibold",
          })}
        >
          Entrar na minha conta
          <ArrowRight
            className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
        <Link
          href="/"
          className="justify-self-center rounded-md px-2 py-1 text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Ver produtos
        </Link>
      </div>
    </section>
  );
}
