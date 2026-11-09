import { SiteHeader } from "@/components/site-header";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      {/* Sem container aqui: a home tem um hero de largura total. As demais
          rotas definem o próprio container (ex.: products/layout.tsx). */}
      <main className="flex flex-1 flex-col">{children}</main>
    </>
  );
}
