import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="min-h-screen bg-white">
         {/*  bg-bg-100 */}
         <Header>
            <div className="flex gap-2">
               <button>나의 견적 확인</button>
               <button>반려한 견적 확인</button>
            </div>
         </Header>

         <DefaultLayout>{children}</DefaultLayout>
      </div>
   );
}
