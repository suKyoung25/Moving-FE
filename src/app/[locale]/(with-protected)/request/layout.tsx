"use client";

import ProgressBar from "@/components/domain/request/ProgressBar";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";
import { useFormWizard } from "@/context/FormWizardContext";

export default function Layout({ children }: { children: React.ReactNode }) {
   const { isPending } = useFormWizard();

   return (
      <div className="bg-bg-200 min-h-screen">
         <Header>{!isPending && <ProgressBar />}</Header>
         <DefaultLayout>{children}</DefaultLayout>
      </div>
   );
}
