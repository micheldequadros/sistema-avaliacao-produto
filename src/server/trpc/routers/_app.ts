import { router } from "../init";
import { createProductProcedure } from "./create-product";
import { productFeedbacksProcedure } from "./product-feedbacks";
import { productsProcedure } from "./products";
import { signInProcedure } from "./sign-in";
import { signOutProcedure } from "./sign-out";
import { signUpProcedure } from "./sign-up";

export const appRouter = router({
  // POST /api/v1/sign-up
  "sign-up": signUpProcedure,
  // POST /api/v1/sign-in
  "sign-in": signInProcedure,
  // POST /api/v1/sign-out
  "sign-out": signOutProcedure,
  // GET /api/v1/products
  products: productsProcedure,
  // POST /api/v1/create-product (público)
  "create-product": createProductProcedure,
  // POST /api/v1/product-feedbacks (logado)
  "product-feedbacks": productFeedbacksProcedure,
});

export type AppRouter = typeof appRouter;
