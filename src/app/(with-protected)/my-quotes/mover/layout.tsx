import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="bg-bg-200 min-h-screen">
         <Header>
            <div>
               <button>버튼1</button>
               <button>버튼2</button>
            </div>
         </Header>

         <DefaultLayout>{children}</DefaultLayout>
      </div>
   );
}
