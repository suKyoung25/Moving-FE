"use client";

import { useFormWizard } from "@/context/FormWizardContext";
import React from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import ChatMessage from "./ChatMessage";
import Image from "next/image";
import SolidButton from "@/components/common/SolidButton";
import carImage from "@/assets/images/emptyCarIcon.svg";
import Link from "next/link";

// 견적 요청 채팅 폼 (단계별 흐름 제어)
export default function FormWizard() {
   const { state } = useFormWizard();
   const { currentStep } = state;

   // Step 4: 견적 요청 진행중 화면 렌더링
   if (currentStep === 4) {
      return (
         <div className="mt-60 flex flex-col items-center gap-8 lg:mt-[194px]">
            <Image
               src={carImage}
               alt="자동차 이미지"
               className="w-61 lg:mb-8 lg:w-[402px]"
            />
            <p className="flex justify-center text-center text-sm text-gray-400 lg:text-xl">
               현재 진행 중인 이사 견적이 있어요!
               <br />
               진행 중인 이사 완료 후 새로운 견적을 받아보세요.
            </p>
            <Link href="/my-quotes/client">
               <SolidButton className="max-w-[196px] px-6">
                  받은 견적 보러가기
               </SolidButton>
            </Link>
         </div>
      );
   }

   // Step 1~3: 채팅 폼 순차 렌더링 (다음 단계에서 이전 단계 채팅 결과 포함)
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
