"use client";

import DefaultLayout from "@/components/layout/DefaultLayout";
import Header from "@/components/layout/Header";
import ProgressBar from "@/components/request/ProgressBar";
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
    <div className=" min-h-screen bg-bg-200">
      <Header>
        <div className="w-full py-4 space-y-4 lg:py-8 lg:space-y-6">
          <h1 className="text-lg font-semibold lg:text-2xl">견적 요청</h1>
          {currentStep !== 4 && <ProgressBar progress={progress} />}
        </div>
      </Header>
      <DefaultLayout>{children}</DefaultLayout>
    </div>
  );
}
