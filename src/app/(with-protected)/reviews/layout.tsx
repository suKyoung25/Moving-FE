import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";
import SomeHeader from "@/components/common/SomeHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="bg-bg-100 min-h-screen">
         <Header>
            <SomeHeader
               tab1Label="작성 가능한 리뷰"
               tab2Label="내가 작성한 리뷰"
            />
         </Header>
         <DefaultLayout>{children}</DefaultLayout>
      </div>
   );
}
