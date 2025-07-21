import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
   return (
      <>
         <Header />
         <DefaultLayout>{children}</DefaultLayout>
      </>
   );
}
