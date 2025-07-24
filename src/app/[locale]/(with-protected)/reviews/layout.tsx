import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";
import SomeHeader from "@/components/common/SomeHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="bg-bg-100 min-h-screen">
         <Header>
            <SomeHeader page="Reviews" />
         </Header>
         <DefaultLayout>{children}</DefaultLayout>
      </div>
   );
}
