import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="min-h-screen">
         <Header>
            <div>이거 이상하게 안됨..</div>
         </Header>

         <DefaultLayout>{children}</DefaultLayout>
      </div>
   );
}
