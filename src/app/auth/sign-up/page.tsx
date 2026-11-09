import type { Metadata } from "next";
import { BRAND_NAME } from "@/components/brand";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: `Criar conta · ${BRAND_NAME}`,
};

export default function SignUpPage() {
  return <SignUpForm />;
}
