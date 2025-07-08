"use client";

import { useFormWizard } from "@/context/FormWizardContext";
import React from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import ChatMessage from "./ChatMessage";
import Image from "next/image";
import SolidButton from "@/components/common/buttons/SolidButton";
import CarImage from "@/assets/images/emptyCarIcon.svg";

export default function FormWizard() {
  const { currentStep } = useFormWizard();

  if (currentStep === 4) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 mt-[127px] lg:mt-[194px]">
        <Image
          src={CarImage}
          alt="자동차 이미지"
          className="w-61 lg:w-[402px] lg:mb-8"
        />
        <p className="flex justify-center text-sm text-center text-gray-400 lg:text-xl">
          현재 진행 중인 이사 견적이 있어요!
          <br />
          진행 중인 이사 완료 후 새로운 견적을 받아보세요.
        </p>
        <SolidButton className="max-w-[196px] px-6">
          받은 견적 보러가기
        </SolidButton>
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col gap-2 lg:gap-6">
        <ChatMessage
          type="system"
          message="몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)"
        />
        {currentStep >= 0 && <Step1 />}
        {currentStep >= 1 && <Step2 />}
        {currentStep >= 2 && <Step3 />}
      </form>
    </>
  );
}
