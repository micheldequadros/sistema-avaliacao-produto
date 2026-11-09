import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getSession } from "@/server/auth/session";
import type { Context } from "@/server/trpc/init";
import { appRouter } from "@/server/trpc/routers/_app";

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/v1",
    req,
    router: appRouter,
    createContext: async (): Promise<Context> => ({
      headers: req.headers,
      session: await getSession(),
    }),
    onError({ path, error }) {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`[tRPC] /api/v1/${path ?? "?"}:`, error.cause ?? error);
      }
    },
  });
}

export { handler as GET, handler as POST };
