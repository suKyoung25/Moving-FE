"use client";

import React, { useEffect, useMemo, useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import ChatMessage from "./ChatMessage";
import SolidButton from "@/components/common/SolidButton";
import carImage from "@/assets/images/emptyCarIcon.svg";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CreateRequestDto, FormWizardState } from "@/lib/types";
import { getClientActiveRequest } from "@/lib/api/estimate/requests/getClientRequest";
import {
   getRequestDraft,
   patchRequestDraft,
} from "@/lib/api/request/requests/requestDraftApi";
import { debounce } from "lodash";
import { createRequestAction } from "@/lib/actions/request.action";
import ToastPopup from "@/components/common/ToastPopup";

interface FormWizardProps {
   currentStep: number;
   setCurrentStep: (val: number) => void;
   isPending: boolean;
   setIsPending: (val: boolean) => void;
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
   isPending,
   setIsPending,
}: FormWizardProps) {
   const { user, isLoading } = useAuth();
   const [formState, setFormState] = useState<FormWizardState>(defaultState);
   const [isInitialized, setIsInitialized] = useState(false);

   const [toast, setToast] = useState<{
      id: number;
      text: string;
      success: boolean;
   } | null>(null);

   const isFormValid =
      !!formState.moveType &&
      !!formState.moveDate &&
      !!formState.fromAddress &&
      !!formState.toAddress;

   useEffect(() => {
      if (isLoading) return;

      const init = async () => {
         if (!user) return;

         try {
            const data = await getClientActiveRequest();
            console.log("활성 견적:", data.request);

            if (data.request) {
               setCurrentStep(4);
               return;
            }

            setCurrentStep(0);
            const draftRes = await getRequestDraft();
            const draft = draftRes?.data;

            if (draft) {
               const {
                  moveType,
                  moveDate,
                  fromAddress,
                  toAddress,
                  currentStep,
               } = draft;

               setFormState({ moveType, moveDate, fromAddress, toAddress });
               setCurrentStep(currentStep ?? 0);
            } else {
               setFormState(defaultState);
               setCurrentStep(0);
            }
         } catch (err) {
            console.error("초기 로딩 실패:", err);
         } finally {
            setIsPending(false);
            setIsInitialized(true);
         }
      };
      init();
   }, [user, isLoading]);

   const debouncedSave = useMemo(
      () =>
         debounce(async (nextState: FormWizardState, step: number) => {
            try {
               await patchRequestDraft({
                  ...nextState,
                  fromAddress: nextState.fromAddress?.trim() || undefined,
                  toAddress: nextState.toAddress?.trim() || undefined,
                  currentStep: step,
               });
            } catch (err) {
               console.error("중간 상태 저장 실패:", err);
            }
         }, 1000),
      [],
   );

   useEffect(() => {
      if (!user || !isInitialized) return;
      if (currentStep >= 1) {
         debouncedSave(formState, currentStep);
         console.log("saved:", { formState, currentStep });
      }
   }, [formState, currentStep, user, isInitialized]);

   const handleConfirm = async () => {
      if (!user || !isFormValid) return;

      try {
         await createRequestAction(formState as CreateRequestDto);

         setToast({
            id: Date.now(),
            text: "견적 요청이 완료되었어요!",
            success: true,
         });

         setCurrentStep(4);
      } catch (err) {
         console.error("견적 요청 실패:", err);

         setToast({
            id: Date.now(),
            text: "이미 진행 중인 견적 요청이 있어요.",
            success: false,
         });
      }
   };

   if (isPending) {
      return <div className="text-center text-gray-400">로딩 중...</div>;
   }

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

            {toast && (
               <ToastPopup
                  key={toast.id}
                  text={toast.text}
                  success={toast.success}
               />
            )}
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
                  isFormValid={isFormValid}
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
                  onConfirm={handleConfirm}
                  onNext={() => setCurrentStep(3)}
               />
            )}
         </form>

         {toast && (
            <ToastPopup
               key={toast.id}
               text={toast.text}
               success={toast.success}
            />
         )}
      </>
   );
}
