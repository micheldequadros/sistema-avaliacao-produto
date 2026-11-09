import Link from "next/link";
import { Brand } from "@/components/brand";

// STUB (Fase 0). Implementação: agente sign-in (área da conta à direita).
export function SiteHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="Página inicial">
          <Brand />
        </Link>
      </div>
    </header>
  );
}
