import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="bg-bg-100 min-h-screen">
         <Header>
            {/* <SomeHeader /> */}
            <div>서브 헤더</div>
         </Header>
         <DefaultLayout>{children}</DefaultLayout>
      </div>
   );
}
