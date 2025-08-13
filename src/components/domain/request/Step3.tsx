"use client";

import React, { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatWrapper from "./ChatWrapper";
import { Request } from "@/lib/types";
import AddressSearch from "./AddressSearch";
import OutlinedButton from "@/components/common/OutlinedButton";
import SolidButton from "@/components/common/SolidButton";
import { useTranslations } from "next-intl";
import { useSaveRequestDraft } from "@/lib/api/request/mutation";
import { useFormWizard } from "@/context/FormWizardContext";

interface Step3Props {
   isFormValid: boolean;
   from?: Request["fromAddress"];
   to?: Request["toAddress"];
   onFromChange: (val: string) => void;
   onToChange: (val: string) => void;
   onReset: () => void;
   onConfirm: () => void;
   onNext: () => void;
}

// 출발지/도착지 주소 입력 단계
export default function Step3({
   isFormValid,
   from,
   to,
   onFromChange,
   onToChange,
   onReset,
   onConfirm,
   onNext,
}: Step3Props) {
   const t = useTranslations("Request");
   const saveDraft = useSaveRequestDraft();
   const { currentStep } = useFormWizard();
   const [targetField, setTargetField] = useState<"from" | "to" | undefined>(
      undefined,
   ); // 현재 열려있는 주소 필드
   const [showModal, setShowModal] = useState<boolean>(false);

   // 주소 선택 완료 시 실행
   const handleComplete = (addr: string) => {
      if (targetField === "from") {
         onFromChange(addr);
      } else if (targetField === "to") {
         onToChange(addr);
      }
      setShowModal(false);
   };

   const handleReset = async () => {
      onReset();
      console.log(currentStep);
      await saveDraft.mutateAsync({
         state: {
            moveType: undefined,
            moveDate: undefined,
            fromAddress: undefined,
            toAddress: undefined,
         },
         currentStep: 0,
      });
   };

   useEffect(() => {
      if (from && to) onNext();
   }, [from, to, onNext]);

   return (
      <>
         {/* 시스템 메세지 */}
         <ChatMessage type="system" message={t("selectMoveAreaPrompt")} />
         {/* 유저 메세지 */}
         <ChatWrapper>
            <label className="text-14-medium lg:text-18-medium">
               {t("from")}
            </label>
            <OutlinedButton
               className="w-full text-left lg:min-w-140"
               onClick={() => {
                  setTargetField("from");
                  setShowModal(true);
               }}
            >
               {from || t("selectFromAddress")}
            </OutlinedButton>
            <label className="text-14-medium lg:text-18-medium">
               {t("to")}
            </label>
            <OutlinedButton
               className="w-full text-left lg:min-w-140"
               onClick={() => {
                  setTargetField("to");
                  setShowModal(true);
               }}
            >
               {to || t("selectToAddress")}
            </OutlinedButton>
            <SolidButton onClick={onConfirm} disabled={!isFormValid}>
               {t("confirmEstimate")}
            </SolidButton>
         </ChatWrapper>
         {/* 주소 검색 모달 */}
         {showModal && (
            <AddressSearch
               type={targetField}
               onComplete={handleComplete}
               onClose={() => setShowModal(false)}
            />
         )}
         {from && to && (
            <button
               type="button"
               onClick={handleReset}
               className="text-16-medium max-lg:text-12-medium mr-2 text-right text-gray-500 underline"
            >
               {t("resetSelection")}
            </button>
         )}
      </>
   );
}
