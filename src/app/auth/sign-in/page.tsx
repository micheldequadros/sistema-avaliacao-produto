import type { Metadata } from "next";
import { BRAND_NAME } from "@/components/brand";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: `Entrar · ${BRAND_NAME}`,
};

export default function SignInPage() {
  return <SignInForm />;
}
