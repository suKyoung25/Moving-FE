import SomeHeader from "@/components/common/SomeHeader";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="bg-bg-200 min-h-screen">
         <Header>
            <SomeHeader tab1Label="보낸 견적 조회" tab2Label="반려 요청" />
         </Header>

         <DefaultLayout>{children}</DefaultLayout>
      </div>
   );
}
