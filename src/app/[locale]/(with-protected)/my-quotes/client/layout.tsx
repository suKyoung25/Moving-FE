import SomeHeader from "@/components/common/SomeHeader";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="min-h-screen bg-white">
         <Header>
            <SomeHeader tab1Label="대기 중인 견적" tab2Label="받았던 견적" />
         </Header>

         <DefaultLayout>{children}</DefaultLayout>
      </div>
   );
}
