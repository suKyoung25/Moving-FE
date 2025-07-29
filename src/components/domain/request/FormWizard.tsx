"use client";

import React, { useEffect, useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import ChatMessage from "./ChatMessage";
import SolidButton from "@/components/common/SolidButton";
import carImage from "@/assets/images/emptyCarIcon.svg";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { FormWizardState } from "@/lib/types";
import { getClientActiveRequests } from "@/lib/api/mover/getClientRequest";

interface FormWizardProps {
   currentStep: number;
   setCurrentStep: (val: number) => void;
}

const defaultState: FormWizardState = {
   moveType: undefined,
   moveDate: undefined,
   fromAddress: undefined,
   toAddress: undefined,
};

export default function FormWizard({
   currentStep,
   setCurrentStep,
}: FormWizardProps) {
   const { user } = useAuth();
   const [formState, setFormState] = useState<FormWizardState>(defaultState);
   const [loading, setLoading] = useState(true);

   const STORAGE_KEY = user ? `requestData_${user.id}` : null;

   // 초기화: localStorage + 서버 데이터 기반
   useEffect(() => {
      const init = async () => {
         if (!user) return;

         const saved = localStorage.getItem(`requestData_${user.id}`);
         if (saved) {
            const parsed = JSON.parse(saved);
            setFormState(parsed);
            setCurrentStep(parsed.currentStep ?? 0);
         }

         const activeRequest = await getClientActiveRequests();
         if (
            !activeRequest ||
            new Date(activeRequest.moveDate) < new Date() ||
            !activeRequest.isPending
         ) {
            setCurrentStep(0); // 요청 가능
         } else {
            setCurrentStep(4); // 새로운 견적 요청 불가
         }
      };

      init();
   }, [user]);

   useEffect(() => {
      if (!user) return;
      const key = `requestData_${user.id}`;
      localStorage.setItem(key, JSON.stringify({ ...formState, currentStep }));
      setLoading(false);
   }, [formState, currentStep, user]);

   if (loading) return <p className="text-center text-gray-500">로딩 중...</p>;

   if (currentStep === 4) {
      return (
         <div className="mt-30 flex flex-col items-center gap-8">
            <Image
               src={carImage}
               alt="견적 요청 진행중"
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

   return (
      <form className="flex flex-col gap-2 lg:gap-6">
         <ChatMessage
            type="system"
            message="몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)"
         />
         {currentStep >= 0 && (
            <Step1
               value={formState.moveType}
               onChange={(v) =>
                  setFormState((prev) => ({ ...prev, moveType: v }))
               }
               onNext={() => setCurrentStep(1)}
            />
         )}
         {currentStep >= 1 && (
            <Step2
               value={formState.moveDate}
               onChange={(v) =>
                  setFormState((prev) => ({ ...prev, moveDate: v }))
               }
               onNext={() => setCurrentStep(2)}
            />
         )}
         {currentStep >= 2 && (
            <Step3
               from={formState.fromAddress}
               to={formState.toAddress}
               onFromChange={(v) =>
                  setFormState((prev) => ({ ...prev, fromAddress: v }))
               }
               onToChange={(v) =>
                  setFormState((prev) => ({ ...prev, toAddress: v }))
               }
               onSubmit={() => {
                  setFormState(defaultState);
                  setCurrentStep(0);
                  localStorage.removeItem(`requestData_${user?.id}`);
               }}
            />
         )}
      </form>
   );
}
