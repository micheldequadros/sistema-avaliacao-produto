import { Package, Star, Users } from "lucide-react";
import { connection } from "next/server";
import type { ComponentType, SVGProps } from "react";
import { getPlatformStats, type PlatformStats } from "@/server/platform/stats";

const compact = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const ITEMS: {
  key: keyof PlatformStats;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: [singular: string, plural: string];
}[] = [
  {
    key: "products",
    icon: Package,
    label: ["Produto para avaliar", "Produtos para avaliar"],
  },
  {
    key: "feedbacks",
    icon: Star,
    label: ["Avaliação publicada", "Avaliações publicadas"],
  },
  {
    key: "accounts",
    icon: Users,
    label: ["Pessoa na comunidade", "Pessoas na comunidade"],
  },
];

/** Números reais, lidos a cada request. Some se o banco falhar ou estiver vazio. */
export async function PlatformStatsRow() {
  // Fora do try: no prerender o Next interrompe aqui de propósito.
  await connection();

  let stats: PlatformStats;
  try {
    stats = await getPlatformStats();
  } catch (error) {
    console.error("[home] getPlatformStats:", error);
    return null;
  }
  if (stats.products === 0) return null;

  return (
    <dl className="grid w-full max-w-2xl grid-cols-3 gap-4">
      {ITEMS.map(({ key, icon: Icon, label }) => (
        <div key={key} className="flex flex-col items-center gap-2 text-center">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-night-raised text-lavender"
          >
            <Icon className="size-4" />
          </span>
          {/* dt antes do dd no DOM (semântica); visualmente o número vem antes. */}
          <dt className="order-last text-xs text-night-muted sm:text-sm">
            {stats[key] === 1 ? label[0] : label[1]}
          </dt>
          <dd className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
            {compact.format(stats[key])}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function PlatformStatsSkeleton() {
  return (
    <div aria-hidden="true" className="grid w-full max-w-2xl grid-cols-3 gap-4">
      {ITEMS.map(({ key }) => (
        <div key={key} className="flex flex-col items-center gap-2">
          <span className="size-9 rounded-lg bg-night-raised" />
          <span className="h-8 w-14 animate-pulse rounded-md bg-night-raised" />
          <span className="h-3.5 w-24 animate-pulse rounded bg-night-raised" />
        </div>
      ))}
    </div>
  );
}
