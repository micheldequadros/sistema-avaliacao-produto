"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { type ReactNode, useState } from "react";
import type { AppRouter } from "@/server/trpc/routers/_app";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

export function TRPCReactProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      // httpLink (sem batch): cada procedure vira uma requisição própria,
      // ex.: POST /api/v1/sign-up com o JSON no body.
      links: [httpLink({ url: "/api/v1" })],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
