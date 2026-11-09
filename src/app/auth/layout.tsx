import { AuthPanel } from "./auth-panel";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="grid flex-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <AuthPanel />
      <main className="flex items-center justify-center px-5 py-10 sm:px-10 lg:py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
