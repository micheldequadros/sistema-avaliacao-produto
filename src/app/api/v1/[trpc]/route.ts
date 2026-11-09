import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc/routers/_app";

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/v1",
    req,
    router: appRouter,
    createContext: () => ({}),
    onError({ path, error }) {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`[tRPC] /api/v1/${path ?? "?"}:`, error.cause ?? error);
      }
    },
  });
}

export { handler as GET, handler as POST };
