"use client";

import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="bg-bg-200 min-h-screen">
         <Header>
            <div>
               <button>견적 프로그래스 바</button>
            </div>
         </Header>
         <DefaultLayout>{children}</DefaultLayout>
      </div>
   );
}
