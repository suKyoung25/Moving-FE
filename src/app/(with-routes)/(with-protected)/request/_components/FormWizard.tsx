"use client";

import { useFormWizard } from "@/context/FormWizardContext";
import React from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import ChatMessage from "./ChatMessage";

export default function FormWizard() {
  const { currentStep } = useFormWizard();

  return (
    <form className="flex flex-col pt-6 gap-2 lg:pt-10 lg:gap-6">
      <ChatMessage
        type="system"
        message="몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)"
      />
      {currentStep >= 0 && <Step1 />}
      {currentStep >= 1 && <Step2 />}
      {currentStep >= 2 && <Step3 />}
    </form>
  );
}
