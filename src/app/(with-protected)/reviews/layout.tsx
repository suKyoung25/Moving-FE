import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";
import SomeHeader from "../../../components/reviews/SomeHeader";

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
