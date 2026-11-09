"use client";

import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ProductError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="mx-auto grid max-w-md justify-items-center gap-5 py-20 text-center"
    >
      <span className="grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <CircleAlert className="size-7" aria-hidden="true" />
      </span>
      <div className="grid gap-2">
        <h1 className="text-3xl font-semibold tracking-tight [font-stretch:90%]">
          Não foi possível carregar o produto
        </h1>
        <p className="text-muted-foreground">
          Tente de novo em instantes. Se o problema continuar, volte para a
          lista de produtos.
        </p>
      </div>
      <div className="flex items-center gap-5">
        <Button
          onClick={() => retry()}
          className="h-11 rounded-lg px-5 text-base font-semibold"
        >
          Tentar de novo
        </Button>
        <Link
          href="/"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Ver produtos
        </Link>
      </div>
    </div>
  );
}
