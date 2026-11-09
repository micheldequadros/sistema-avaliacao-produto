import { PackageSearch } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="mx-auto grid max-w-md justify-items-center gap-5 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <PackageSearch className="size-7" aria-hidden="true" />
      </span>
      <div className="grid gap-2">
        <h1 className="text-3xl font-semibold tracking-tight [font-stretch:90%]">
          Produto não encontrado
        </h1>
        <p className="text-muted-foreground">
          O link pode estar errado ou o produto foi removido.
        </p>
      </div>
      <Link
        href="/"
        className={buttonVariants({
          className: "h-11 rounded-lg px-5 text-base font-semibold",
        })}
      >
        Ver todos os produtos
      </Link>
    </div>
  );
}
