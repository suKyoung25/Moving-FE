import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";
import MyQuotesLayout from "@/components/layout/MyQuotesLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="min-h-screen bg-white">
         <Header>
            <MyQuotesLayout />
         </Header>

         <DefaultLayout>{children}</DefaultLayout>
      </div>
   );
}
