"use client";

import React, { useEffect, useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import ChatMessage from "./ChatMessage";
import { useAuth } from "@/context/AuthContext";
import { CreateRequestDto, FormWizardState } from "@/lib/types";
import { createRequestAction } from "@/lib/actions/request.action";
import { useFormWizard } from "@/context/FormWizardContext";
import { useActiveRequest, useRequestDraft } from "@/lib/api/request/query";
import Step4 from "./Step4";
import { useLocale, useTranslations } from "next-intl";
import { useToast } from "@/context/ToastConText";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useSaveRequestDraft } from "@/lib/api/request/mutation";
import Spinner from "@/components/common/Spinner";

const defaultState: FormWizardState = {
   moveType: undefined,
   moveDate: undefined,
   fromAddress: undefined,
   toAddress: undefined,
};

export default function FormWizard({}) {
   const t = useTranslations("Request");
   const locale = useLocale();
   const { user, isLoading } = useAuth();
   const { currentStep, setCurrentStep, isPending, setIsPending } =
      useFormWizard();
   const { showSuccess, showError } = useToast();
   const [formState, setFormState] = useState<FormWizardState>(defaultState);
   const [isInitialized, setIsInitialized] = useState(false);
   const queryClient = useQueryClient();
   const pathname = usePathname();

   const isFormValid =
      !!formState.moveType &&
      !!formState.moveDate &&
      !!formState.fromAddress &&
      !!formState.toAddress;

   const { data: activeRequest, isPending: isActivePending } =
      useActiveRequest(locale);

   const {
      data: draft,
      isPending: isDraftPending,
      refetch,
   } = useRequestDraft(locale);

   const saveDraft = useSaveRequestDraft();

   useEffect(() => {
      refetch();
   }, [pathname]);

   useEffect(() => {
      if (isLoading || isActivePending || isDraftPending || isInitialized)
         return;

      if (activeRequest?.data) {
         setCurrentStep(4);
         setIsPending(false);
         setIsInitialized(true);
         return;
      }

      const local = localStorage.getItem(`draft_${user?.id}`);
      if (local) {
         const parsed = JSON.parse(local);
         setFormState(parsed);
         setCurrentStep(parsed.currentStep);
         setIsPending(false);
         setIsInitialized(true);
         return;
      }

      // 로컬이 없으면 서버 draft 사용
      if (draft?.data) {
         const {
            moveType,
            moveDate,
            fromAddress,
            toAddress,
            currentStep: draftStep,
         } = draft.data;

         setFormState({
            moveType,
            moveDate: moveDate ? new Date(moveDate) : undefined,
            fromAddress,
            toAddress,
         });
         setCurrentStep(draftStep ?? 0);
      } else {
         setFormState(defaultState);
         setCurrentStep(0);
      }
      queryClient.invalidateQueries({ queryKey: ["requestDraft"] });
      setIsPending(false);
      setIsInitialized(true);
   }, [
      user,
      isActivePending,
      isDraftPending,
      activeRequest,
      draft,
      isInitialized,
      setCurrentStep,
      setIsPending,
   ]);

   useEffect(() => {
      if (!isInitialized || !user) return;
      if (currentStep === 4) return;
      localStorage.setItem(
         `draft_${user.id}`,
         JSON.stringify({ ...formState, currentStep }),
      );
      saveDraft.mutate({ state: formState, currentStep });
   }, [formState, currentStep]);

   const handleConfirm = async () => {
      try {
         await createRequestAction(formState as CreateRequestDto);
         if (user?.id) {
            localStorage.removeItem(`draft_${user.id}`);
         }
         queryClient.invalidateQueries({ queryKey: ["activeRequest"] });
         showSuccess(t("toast.success"));
         setCurrentStep(4);
      } catch (err) {
         console.error("견적 요청 실패:", err);
         showError(t("toast.fail"));
      }
   };

   if (isPending) {
      return <Spinner />;
   }

   if (currentStep === 4) {
      return <Step4 />;
   }

   return (
      <form className="flex flex-col gap-2 lg:gap-6">
         <ChatMessage type="system" message={t("systemInfoMessage")} />

         <Step1
            value={formState.moveType}
            onChange={(v) => setFormState((prev) => ({ ...prev, moveType: v }))}
            onNext={() => setCurrentStep(1)}
         />
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
