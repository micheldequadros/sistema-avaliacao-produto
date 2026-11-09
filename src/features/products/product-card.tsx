"use client";

import { cn } from "cn";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "./schema";

type ImageStatus = "loading" | "loaded" | "error";

/**
 * `<img>` em vez de `next/image`: as URLs podem vir de qualquer host e
 * `next/image` exigiria liberar `remotePatterns` para todos eles.
 */
function ProductImage({ src, name }: { src: string; name: string }) {
  const [status, setStatus] = useState<ImageStatus>("loading");

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
      {status === "error" ? (
        <div className="absolute inset-0 grid place-items-center bg-lavender/20">
          <span
            aria-hidden="true"
            className="text-6xl font-semibold tracking-tight text-primary/70"
          >
            {name.trim().charAt(0).toUpperCase()}
          </span>
        </div>
      ) : (
        // biome-ignore lint/performance/noImgElement: hosts arbitrários; ver comentário acima
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn(
            "size-full object-cover transition-[opacity,scale] duration-500 ease-out motion-reduce:transition-none",
            "group-hover/card:scale-[1.03]",
            status === "loaded" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group/card relative flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors duration-200 hover:border-primary/40 has-[h2_a:focus-visible]:border-primary has-[h2_a:focus-visible]:ring-3 has-[h2_a:focus-visible]:ring-ring/30">
      <ProductImage src={product.imageUrl} name={product.name} />

      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-lg leading-snug font-semibold tracking-tight text-balance">
          <Link
            href={`/products/${product.id}`}
            className="outline-none after:absolute after:inset-0 after:content-[''] group-hover/card:text-primary"
          >
            {product.name}
          </Link>
        </h2>

        {product.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        ) : null}

        <div className="mt-auto pt-4">
          <a
            href={product.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-1 rounded-sm text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Ver produto
            <ArrowUpRight aria-hidden="true" className="size-4" />
            <span className="sr-only">
              {` ${product.name} no site da loja (abre em nova aba)`}
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}
