import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";
import SomeHeader from "./_components/SomeHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-100">
      <Header>
        <SomeHeader />
      </Header>
      <DefaultLayout>{children}</DefaultLayout>
    </div>
  );
}
