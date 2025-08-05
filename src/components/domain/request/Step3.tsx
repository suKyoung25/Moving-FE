"use client";

import React, { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatWrapper from "./ChatWrapper";
import { Request } from "@/lib/types";
import AddressSearch from "./AddressSearch";
import OutlinedButton from "@/components/common/OutlinedButton";
import SolidButton from "@/components/common/SolidButton";

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
   const [fromAddress, setFromAddress] = useState<
      Request["fromAddress"] | undefined
   >(from);
   const [toAddress, setToAddress] = useState<Request["toAddress"] | undefined>(
      to,
   );
   const [targetField, setTargetField] = useState<"from" | "to" | undefined>(
      undefined,
   ); // 현재 열려있는 주소 필드
   const [showModal, setShowModal] = useState<boolean>(false);

   // 주소 선택 완료 시 실행
   const handleComplete = (addr: string) => {
      if (targetField === "from") {
         setFromAddress(addr);
         onFromChange(addr);
      } else if (targetField === "to") {
         setToAddress(addr);
         onToChange(addr);
      }
      setShowModal(false);
   };

   useEffect(() => {
      if (fromAddress && toAddress) {
         onNext();
      }
   }, [fromAddress, toAddress, onNext]);

   return (
      <>
         {/* 시스템 메세지 */}
         <ChatMessage type="system" message="이사 지역을 선택해 주세요." />
         {/* 유저 메세지 */}
         <ChatWrapper>
            <label className="text-sm font-medium lg:text-lg">출발지</label>
            <OutlinedButton
               className="text-left lg:w-140"
               onClick={() => {
                  setTargetField("from");
                  setShowModal(true);
               }}
            >
               {fromAddress || "출발지 선택하기"}
            </OutlinedButton>
            <label className="text-sm font-medium lg:text-lg">도착지</label>
            <OutlinedButton
               className="text-left lg:w-140"
               onClick={() => {
                  setTargetField("to");
                  setShowModal(true);
               }}
            >
               {toAddress || "도착지 선택하기"}
            </OutlinedButton>
            <SolidButton onClick={onConfirm} disabled={!isFormValid}>
               견적 확정하기
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
         {fromAddress && toAddress && (
            <button
               type="button"
               onClick={onReset}
               className="mr-2 text-right font-medium text-gray-500 underline max-lg:text-xs"
            >
               처음부터 다시 선택
            </button>
         )}
      </>
   );
}
