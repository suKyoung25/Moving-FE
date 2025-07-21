import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="min-h-screen bg-white">
         {/*  bg-bg-100 */}
         <Header>
            <div>
               <button>1</button>
               <button>2</button>
            </div>
         </Header>

         <DefaultLayout>{children}</DefaultLayout>
      </div>
   );
}
