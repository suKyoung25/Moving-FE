import TabButtons from "@/components/common/buttons/Tabbuttons";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="bg-bg-200 min-h-screen">
         <Header>
            <TabButtons />
         </Header>

         <DefaultLayout>{children}</DefaultLayout>
      </div>
   );
}
