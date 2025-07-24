import GuestLayout from "@/components/layout/GuestLayout";
import Header from "@/components/layout/Header";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
   return (
      <>
         <Header />
         <GuestLayout>{children}</GuestLayout>
      </>
   );
}
