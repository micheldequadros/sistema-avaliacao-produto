import { ChartLine, Radio, Sparkles } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Brand, STAR_PATH } from "@/components/brand";

const FEATURES: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}[] = [
  {
    icon: Radio,
    title: "Avaliações em tempo real",
    description: "Cada nova avaliação aparece no painel assim que chega.",
  },
  {
    icon: Sparkles,
    title: "Resumos com IA",
    description:
      "Temas, sentimento e sugestões de melhoria, sem ler uma a uma.",
  },
  {
    icon: ChartLine,
    title: "Tendências por produto",
    description: "Veja a nota de cada produto subir ou cair ao longo do tempo.",
  },
];

// Placeholder: substituir por um depoimento real quando houver.
const TESTIMONIAL = {
  quote:
    "Passávamos a semana lendo avaliações. Agora sabemos no mesmo dia o que precisa mudar no produto.",
  name: "Carla Mendes",
  role: "Gerente de produto",
};

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
            Descubra o que seus clientes pensam de cada produto
          </h1>
          <p className="max-w-[46ch] text-night-muted lg:text-lg">
            Reúna as avaliações em um só lugar e deixe a IA mostrar o que
            elogiam, o que criticam e o que melhorar.
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

      <figure className="mt-12 hidden max-w-[34rem] rounded-2xl border border-white/10 bg-night-raised/80 p-6 lg:block">
        <span className="flex gap-1" role="img" aria-label="Nota 5 de 5">
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
        <blockquote className="mt-4 leading-relaxed text-pretty">
          “{TESTIMONIAL.quote}”
        </blockquote>
        <figcaption className="mt-5 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-full bg-lavender text-sm font-semibold text-night"
          >
            {TESTIMONIAL.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </span>
          <span className="grid text-sm">
            <span className="font-medium">{TESTIMONIAL.name}</span>
            <span className="text-night-muted">{TESTIMONIAL.role}</span>
          </span>
        </figcaption>
      </figure>
    </aside>
  );
}
