import { ArrowDown, MessageSquareQuote } from "lucide-react";
import { Suspense } from "react";
import { PlatformStatsRow, PlatformStatsSkeleton } from "./platform-stats";

export function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden bg-night text-night-foreground"
    >
      {/* Brilho violeta/lavanda + grade de pontos sutil, só decoração. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_85%_110%,color-mix(in_oklab,var(--primary)_45%,transparent),transparent),radial-gradient(45%_55%_at_10%_-10%,color-mix(in_oklab,var(--lavender)_18%,transparent),transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(color-mix(in_oklab,var(--night-foreground)_9%,transparent)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_80%_at_50%_40%,black,transparent)]"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-night-raised/70 px-3.5 py-1.5 text-xs font-medium text-night-muted backdrop-blur">
          <MessageSquareQuote
            className="size-3.5 text-lavender"
            aria-hidden="true"
          />
          Avaliações de quem já usou
        </p>

        <div className="grid max-w-3xl gap-5">
          <h1
            id="home-hero-title"
            className="text-[2.5rem] leading-[1.04] font-semibold tracking-[-0.01em] text-balance [font-stretch:92%] sm:text-6xl lg:text-7xl"
          >
            Descubra e avalie{" "}
            <span className="bg-[linear-gradient(100deg,var(--lavender),#e6d4ff_55%,var(--lavender))] bg-clip-text text-transparent">
              produtos incríveis
            </span>
          </h1>
          <p className="mx-auto max-w-[52ch] text-base leading-relaxed text-pretty text-night-muted sm:text-lg">
            Explore produtos, leia avaliações da comunidade e compartilhe sua
            opinião para ajudar outras pessoas a decidir melhor.
          </p>
        </div>

        <Suspense fallback={<PlatformStatsSkeleton />}>
          <PlatformStatsRow />
        </Suspense>

        <a
          href="#produtos"
          className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-night-muted outline-none transition-colors hover:text-night-foreground focus-visible:ring-3 focus-visible:ring-lavender/50"
        >
          Ver produtos
          <ArrowDown
            className="size-4 transition-transform motion-safe:group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  );
}
