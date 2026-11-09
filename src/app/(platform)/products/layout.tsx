export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto w-full max-w-6xl px-5 py-10">{children}</div>;
}
