import { Check } from "lucide-react";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/components/brand";

export const metadata: Metadata = {
  title: `Conta criada · ${BRAND_NAME}`,
};

export default function SignUpSuccessPage() {
  return (
    <section className="grid gap-4">
      <span className="grid size-12 place-items-center rounded-full bg-verified text-white">
        <Check className="size-6" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <h2 className="mt-2 text-[1.95rem] leading-tight font-semibold tracking-tight [font-stretch:88%]">
        Conta criada
      </h2>
      <p className="text-muted-foreground">
        Sua conta está pronta. O próximo passo será conectar seus produtos para
        começar a receber as avaliações.
      </p>
    </section>
  );
}
