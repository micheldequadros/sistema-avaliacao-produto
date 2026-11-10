import { z } from "zod";

export const PRODUCTS_PAGE_SIZE = 12;

/** Entrada de `GET /api/v1/products` (paginação por cursor opaco). */
export const listProductsInput = z.object({
  cursor: z.string().max(200).nullish(),
  limit: z.number().int().min(1).max(50).default(PRODUCTS_PAGE_SIZE),
});

/** Entrada de `POST /api/v1/create-product`. */
export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome do produto")
    .max(120, "Máximo de 120 caracteres"),
  description: z
    .string()
    .trim()
    .max(500, "Máximo de 500 caracteres")
    .optional()
    .transform((value) => value || undefined),
  /** URL da imagem (coluna `image_url`). */
  image: z
    .url({ protocol: /^https?$/, error: "Informe uma URL http(s) da imagem" })
    .max(2048, "URL muito longa"),
  /** Página do produto fora do app (coluna `external_link`). */
  link: z
    .url({
      protocol: /^https?$/,
      error: "Informe uma URL http(s) do produto",
    })
    .max(2048, "URL muito longa"),
});

export type CreateProductInput = z.input<typeof createProductSchema>;

/** Produto como a API devolve (camelCase). */
export type Product = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  externalLink: string;
  createdAt: string;
};

export type ProductsPage = {
  items: Product[];
  nextCursor: string | null;
};
