import { MessageSquareText, Search, Star } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Brand, STAR_PATH } from "@/components/brand";

// Só o que o app faz hoje: nada de promessas de funcionalidades futuras.
const FEATURES: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}[] = [
  {
    icon: Search,
    title: "Descubra produtos",
    description: "Navegue pelos produtos e abra cada um para ver a nota média.",
  },
  {
    icon: MessageSquareText,
    title: "Leia opiniões reais",
    description: "Avaliações escritas por pessoas que já usaram o produto.",
  },
  {
    icon: Star,
    title: "Compartilhe a sua",
    description: "Dê uma nota de 1 a 5 e conte como foi sua experiência.",
  },
];

export function AuthPanel() {
  return (
    <aside className="relative isolate flex flex-col overflow-hidden bg-night px-6 py-8 text-night-foreground sm:px-10 lg:min-h-dvh lg:px-14 lg:py-12">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_100%_100%,color-mix(in_oklab,var(--lavender)_20%,transparent),transparent)]"
      />

      <Brand />

      <div className="grid max-w-[34rem] gap-10 pt-10 lg:my-auto lg:pt-16">
        <header className="grid gap-4">
          <h1 className="text-[2rem] leading-[1.06] font-semibold tracking-[-0.005em] text-balance [font-stretch:90%] sm:text-[2.44rem] lg:text-[3.05rem]">
            Descubra o que as pessoas acham de cada produto
          </h1>
          <p className="max-w-[46ch] text-night-muted lg:text-lg">
            Leia avaliações de quem já usou e compartilhe a sua para ajudar
            outras pessoas a decidir melhor.
          </p>
        </header>

        <ul className="hidden gap-6 lg:grid">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-night-raised text-lavender">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="grid gap-0.5">
                <span className="font-medium">{title}</span>
                <span className="text-sm text-night-muted">{description}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 hidden max-w-[34rem] items-center gap-4 rounded-2xl border border-white/10 bg-night-raised/80 p-6 lg:flex">
        <span className="flex shrink-0 gap-1" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg
              key={i}
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4 fill-star"
            >
              <path d={STAR_PATH} />
            </svg>
          ))}
        </span>
        <p className="text-sm leading-relaxed text-pretty text-night-muted">
          <span className="font-medium text-night-foreground">
            Uma avaliação por pessoa em cada produto.
          </span>{" "}
          Assim as notas refletem opiniões reais.
        </p>
      </div>
    </aside>
  );
}
