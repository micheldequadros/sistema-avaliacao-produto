import { router } from "../init";
import { signUpProcedure } from "./sign-up";

export const appRouter = router({
  // POST /api/v1/sign-up
  "sign-up": signUpProcedure,
});

export type AppRouter = typeof appRouter;
