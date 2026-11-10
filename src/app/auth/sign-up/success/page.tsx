import {
  ArrowRight,
  Check,
  MessageSquareText,
  Search,
  Star,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { BRAND_NAME, STAR_PATH } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: `Conta criada · ${BRAND_NAME}`,
};

const NEXT_STEPS: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  text: string;
}[] = [
  { icon: Search, text: "Veja o que outras pessoas acharam" },
  { icon: Star, text: "Dê sua nota, de 1 a 5 estrelas" },
  { icon: MessageSquareText, text: "Conte sua experiência em um comentário" },
];

export default function SignUpSuccessPage() {
  return (
    <section className="grid gap-6">
      <SuccessMark />

      <header className="grid gap-2">
        <p className="text-sm font-semibold text-verified">Conta criada</p>
        <h2 className="text-[1.95rem] leading-tight font-semibold tracking-tight text-balance [font-stretch:88%]">
          Boas-vindas à comunidade!
        </h2>
        <p className="text-pretty text-muted-foreground">
          Tudo pronto. Entre com o email e a senha que você acabou de cadastrar
          para começar a avaliar.
        </p>
      </header>

      <ul className="grid gap-3 rounded-xl border bg-card p-4">
        {NEXT_STEPS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm">
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
            >
              <Icon className="size-4" />
            </span>
            {text}
          </li>
        ))}
      </ul>

      <div className="grid gap-3">
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
          Explorar produtos antes
        </Link>
      </div>
    </section>
  );
}

/** Estrela da marca com selo de confirmação; entra com um leve zoom. */
function SuccessMark() {
  return (
    <div
      aria-hidden="true"
      className="relative size-16 motion-safe:animate-in motion-safe:zoom-in-75 motion-safe:fade-in motion-safe:duration-500"
    >
      <span className="absolute inset-0 rounded-2xl bg-primary/15 motion-safe:animate-ping motion-safe:[animation-iteration-count:1] motion-safe:[animation-duration:1.2s]" />
      <span className="relative grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_10px_30px_-10px_var(--primary)]">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-8"
          fill="currentColor"
        >
          <path d={STAR_PATH} />
        </svg>
      </span>
      <span className="absolute -right-1.5 -bottom-1.5 grid size-7 place-items-center rounded-full bg-verified text-white ring-4 ring-background motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:delay-300 motion-safe:duration-300 motion-safe:fill-mode-backwards">
        <Check className="size-4" strokeWidth={3} />
      </span>
    </div>
  );
}
