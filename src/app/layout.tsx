import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import { BRAND_NAME } from "@/components/brand";
import { TRPCReactProvider } from "@/lib/trpc/client";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "wdth"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: BRAND_NAME,
  description: "Avaliações de produtos feitas por quem comprou.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${bricolage.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
