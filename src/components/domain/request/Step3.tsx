"use client";

import React, { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatWrapper from "./ChatWrapper";
import { Request } from "@/lib/types";
import AddressSearch from "./AddressSearch";
import { useFormWizard } from "@/context/FormWizardContext";
import { createRequestAction } from "@/lib/actions/request.action";
import OutlinedButton from "@/components/common/OutlinedButton";
import SolidButton from "@/components/common/SolidButton";
import { useAuth } from "@/context/AuthContext";
import ToastPopup from "@/components/common/ToastPopup";
import toast from "react-hot-toast";

// 출발지/도착지 주소 입력 단계
export default function Step3() {
   const { user } = useAuth();
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
      if (!user) return;
      const requestData = localStorage.getItem(`requestData_${user.id}`);

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

         // 성공 알림
         toast.custom((t) => (
            <ToastPopup
               className={`${
                  t.visible ? "animate-fade-in" : "animate-fade-out"
               }`}
            >
               견적 요청이 완료되었어요!
            </ToastPopup>
         ));
      } catch (err) {
         console.error("견적 요청 실패:", err);

         // 에러 알림
         toast.custom((t) => (
            <ToastPopup
               className={`${
                  t.visible ? "animate-fade-in" : "animate-fade-out"
               }`}
            >
               견적 요청에 실패했어요.
            </ToastPopup>
         ));
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
            <SolidButton
               onClick={handleConfirm}
               disabled={!fromAddress || !toAddress}
            >
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
         {currentStep === 3 && (
            <button
               type="button"
               onClick={() => dispatch({ type: "RESET" })}
               className="mr-2 text-right font-medium text-gray-500 underline max-lg:text-xs"
            >
               처음부터 다시 선택
            </button>
         )}
      </>
   );
}
