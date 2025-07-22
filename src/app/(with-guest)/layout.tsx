import Header from "@/components/layout/Header";
import DefaultLayout from "@/components/layout/DefaultLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <>
         <Header />
         <DefaultLayout>{children}</DefaultLayout>
      </>
   );
}
