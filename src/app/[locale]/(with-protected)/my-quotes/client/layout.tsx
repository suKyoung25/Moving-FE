import SomeHeader from "@/components/common/SomeHeader";
import { CustomLayout } from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="min-h-screen bg-white">
         <Header>
            <SomeHeader page="MyQuotes.Client" />
         </Header>

         <CustomLayout>{children}</CustomLayout>
      </div>
   );
}
