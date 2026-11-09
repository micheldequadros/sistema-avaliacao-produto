import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Redirect antes da renderização: um redirect() dentro de page.tsx quebra a
  // validação de navegação instantânea (instant) do Cache Components.
  async redirects() {
    return [{ source: "/", destination: "/auth/sign-up", permanent: false }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
