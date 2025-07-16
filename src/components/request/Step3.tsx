"use client";

import { useFormWizard } from "@/context/FormWizardContext";
import React, { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatWrapper from "./ChatWrapper";
import SolidButton from "@/components/common/buttons/SolidButton";
import OutlinedButton from "@/components/common/buttons/OutlinedButton";
import AddressModal from "./AddressModal";
import { Request } from "@/lib/types";
import { createRequestAction } from "@/lib/actions/request/request.action";

// 출발지/도착지 주소 입력 단계
export default function Step3() {
   const { state, dispatch, goToNextStep } = useFormWizard();
   const { currentStep } = state;
   const [fromAddress, setFromAddress] = useState<
      Request["fromAddress"] | undefined
   >(state.fromAddress);
   const [toAddress, setToAddress] = useState<Request["toAddress"] | undefined>(
      state.toAddress,
   );
   const [targetField, setTargetField] = useState<"from" | "to" | null>(null); // 현재 열려있는 주소 필드
   const [showModal, setShowModal] = useState<boolean>(false);

   // 주소 선택 완료 시 실행
   const handleComplete = (addr: string) => {
      if (targetField === "from") {
         setFromAddress(addr);
         dispatch({ type: "SET_FROM_ADDRESS", payload: addr });
      } else if (targetField === "to") {
         setToAddress(addr);
         dispatch({ type: "SET_TO_ADDRESS", payload: addr });
      }
      setShowModal(false);
   };

   // 견적 확정 버튼 클릭 시 새로운 견적 생성
   const handleConfirm = async () => {
      const requestData = localStorage.getItem("requestData");

      if (!requestData) {
         console.error("요청 데이터가 존재하지 않습니다.");
         return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { currentStep, ...rest } = JSON.parse(requestData);

      try {
         await createRequestAction(rest);

         // 요청 성공 시 localStorage 초기화
         dispatch({ type: "RESET_FORM_ONLY" });
         localStorage.removeItem("requestData");
      } catch (err) {
         console.error("견적 요청 실패:", err);
      }
   };

   // 출발지/도착지 둘 다 입력되면 다음 단계(폼 완성 상태)로 이동
   useEffect(() => {
      if (currentStep === 2 && fromAddress && toAddress) {
         goToNextStep();
      }
   }, [fromAddress, toAddress, currentStep, goToNextStep]);

   return (
      <>
         {/* 시스템 메세지 */}
         <ChatMessage type="system" message="이사 지역을 선택해 주세요." />

         {/* 유저 메세지 */}
         <ChatWrapper className="px-6 py-5 lg:p-8">
            <label className="text-sm font-medium lg:text-lg">출발지</label>
            <OutlinedButton
               className="w-72 text-left lg:w-140"
               onClick={() => {
                  setTargetField("from");
                  setShowModal(true);
               }}
            >
               {fromAddress || "출발지 선택하기"}
            </OutlinedButton>
            <label className="text-sm font-medium lg:text-lg">도착지</label>
            <OutlinedButton
               className="text-left"
               onClick={() => {
                  setTargetField("to");
                  setShowModal(true);
               }}
            >
               {toAddress || "도착지 선택하기"}
            </OutlinedButton>
            <SolidButton
               onClick={handleConfirm}
               disabled={!fromAddress || !toAddress}
            >
               견적 확정하기
            </SolidButton>
         </ChatWrapper>

         {/* 주소 검색 모달 */}
         {showModal && (
            <AddressModal
               type={targetField}
               onSelect={handleComplete}
               onClose={() => setShowModal(false)}
            />
         )}
      </>
   );
}
