import Header from "@/components/layout/header/Header";
import { AuthProvider } from "@/context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <Header />
        <main className="max-w-[1400px] mx-auto px-6 py-6 md:px-16 lg:px-0 lg:py-10">
          {children}
        </main>
      </AuthProvider>
    </>
  );
}
