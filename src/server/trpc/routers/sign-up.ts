import "server-only";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { signUpSchema } from "@/features/auth/sign-up/schema";
import { getSupabase } from "@/server/db/supabase";
import { publicProcedure } from "../init";

const BCRYPT_ROUNDS = 10;
const UNIQUE_VIOLATION = "23505";

export const signUpProcedure = publicProcedure
  .input(signUpSchema)
  .mutation(async ({ input }) => {
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    const passwordHash = await bcrypt.hash(input.password, salt);
    const id = nanoid();

    const { error } = await getSupabase().from("accounts").insert({
      id,
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      password: passwordHash,
      salt,
      active: true,
    });

    if (error) {
      // A constraint UNIQUE(email) é a fonte da verdade — sem corrida entre checar e inserir.
      if (error.code === UNIQUE_VIOLATION) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Este email já está cadastrado.",
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Não foi possível criar a conta.",
        cause: error,
      });
    }

    return { id };
  });
