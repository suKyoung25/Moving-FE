"use client";

import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";
import ProgressBar from "@/components/domain/request/ProgressBar";
import { useEffect, useState } from "react";
import { useFormWizard } from "@/context/FormWizardContext";

export default function Layout({ children }: { children: React.ReactNode }) {
   const { state } = useFormWizard();
   const { currentStep } = state;
   const [progress, setProgress] = useState(0);

   // 현재 단계에 따라 ProgressBar 업데이트
   useEffect(() => {
      setProgress((currentStep + 1) * 25);
   }, [currentStep]);

   return (
      <div className="bg-bg-200 min-h-screen">
         <Header>
            <div className="w-full space-y-4 py-4 lg:space-y-6 lg:py-8">
               <h1 className="text-lg font-semibold lg:text-2xl">견적 요청</h1>
               {currentStep !== 4 && <ProgressBar progress={progress} />}
            </div>
         </Header>
         <DefaultLayout>{children}</DefaultLayout>
      </div>
   );
}
