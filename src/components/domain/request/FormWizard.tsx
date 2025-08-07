"use client";

import React, { useEffect, useMemo, useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import ChatMessage from "./ChatMessage";
import { useAuth } from "@/context/AuthContext";
import { CreateRequestDto, FormWizardState } from "@/lib/types";
import { patchRequestDraft } from "@/lib/api/request/requests/requestDraftApi";
import { debounce } from "lodash";
import { createRequestAction } from "@/lib/actions/request.action";
import { useFormWizard } from "@/context/FormWizardContext";
import {
   useActiveRequest,
   useRequestDraft,
} from "@/lib/api/request/requests/query";
import Step4 from "./Step4";
import { useTranslations } from "next-intl";
import { useToast } from "@/context/ToastConText";
import { useQueryClient } from "@tanstack/react-query";

const defaultState: FormWizardState = {
   moveType: undefined,
   moveDate: undefined,
   fromAddress: undefined,
   toAddress: undefined,
};

export default function FormWizard({}) {
   const t = useTranslations("Request");
   const { isLoading } = useAuth();
   const { currentStep, setCurrentStep, isPending, setIsPending } =
      useFormWizard();
   const { showSuccess, showError } = useToast();
   const [formState, setFormState] = useState<FormWizardState>(defaultState);
   const [isInitialized, setIsInitialized] = useState(false);
   const queryClient = useQueryClient();

   const isFormValid =
      !!formState.moveType &&
      !!formState.moveDate &&
      !!formState.fromAddress &&
      !!formState.toAddress;

   const { data: activeRequest, isPending: isActivePending } =
      useActiveRequest();

   const { data: draftRes, isPending: isDraftPending } = useRequestDraft();

   useEffect(() => {
      if (isLoading || isActivePending || isDraftPending) return;

      if (activeRequest?.data) {
         setCurrentStep(4);
         setIsPending(false);
         return;
      }

      if (draftRes?.data) {
         const { moveType, moveDate, fromAddress, toAddress, currentStep } =
            draftRes.data;
         setFormState({ moveType, moveDate, fromAddress, toAddress });
         setCurrentStep(currentStep);
      } else {
         setFormState(defaultState);
         setCurrentStep(0);
      }
      setIsInitialized(true);
      setIsPending(false);
   }, [
      isLoading,
      isActivePending,
      isDraftPending,
      activeRequest,
      draftRes,
      isInitialized,
      setCurrentStep,
      setIsPending,
   ]);

   // 견적 요청 상태 중간 저장
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
      if (!isInitialized) return;
      if (currentStep >= 1 && currentStep < 4) {
         debouncedSave(formState, currentStep);
      }
   }, [formState, currentStep, isInitialized, debouncedSave]);

   const handleConfirm = async () => {
      try {
         await createRequestAction(formState as CreateRequestDto);
         queryClient.invalidateQueries({ queryKey: ["activeRequest"] });
         showSuccess(t("toast.success"));
         setCurrentStep(4);
      } catch (err) {
         console.error("견적 요청 실패:", err);
         showError(t("toast.fail"));
      }
   };

   if (isPending) {
      return <div className="text-center text-gray-400">{t("loading")}</div>;
   }

   if (currentStep === 4) {
      return <Step4 />;
   }

   return (
      <form className="flex flex-col gap-2 lg:gap-6">
         <ChatMessage type="system" message={t("systemInfoMessage")} />
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
               onReset={() => {
                  setFormState(defaultState);
                  setCurrentStep(0);
               }}
               onConfirm={handleConfirm}
               onNext={() => setCurrentStep(3)}
            />
         )}
      </form>
   );
}
