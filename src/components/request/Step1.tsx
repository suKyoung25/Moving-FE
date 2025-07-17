"use client";

import { useFormWizard } from "@/context/FormWizardContext";
import { Request } from "@/lib/types";
import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import Image from "next/image";
import CheckedIcon from "@/assets/images/roundActiveIcon.svg";
import UncheckedIcon from "@/assets/images/roundDefaultIcon.svg";
import SolidButton from "@/components/common/buttons/SolidButton";
import ChatWrapper from "./ChatWrapper";

// 이사 종류 선택 단계
export default function Step1() {
   const { state, dispatch, goToNextStep } = useFormWizard();
   const { moveType } = state;
   const [selected, setSelected] = useState<Request["moveType"]>();
   const [isEditing, setIsEditing] = useState<boolean>(false);

   const selectOptions = [
      { label: "소형이사 (원룸, 투룸, 20평대 미만)", value: "SMALL" },
      { label: "가정이사 (쓰리룸, 20평대 이상)", value: "HOME" },
      { label: "사무실이사 (사무실, 상업공간)", value: "OFFICE" },
   ] as const;

   const selectedLabel = selectOptions.find(
      (option) => option.value === moveType,
   )?.label;

   const handleSelect = (type: Request["moveType"]) => {
      setSelected(type);
   };

   // 선택완료 버튼 클릭 시 실행
   const handleSubmit = () => {
      // 폼 상태를 업데이트하는 dispatch 헬퍼 함수
      dispatch({ type: "SET_MOVE_TYPE", payload: selected });
      if (!isEditing) {
         goToNextStep(); // 다음 단계로 이동
      } else {
         setIsEditing(false); // 수정모드 종료
      }
   };

   return (
      <>
         {/* 시스템 메시지 */}
         <ChatMessage type="system" message="이사 종류를 선택해 주세요." />

         {/* 유저 메세지 */}
         {moveType && !isEditing ? ( // 선택 완료 시
            <ChatMessage
               type="user"
               message={selectedLabel ?? ""}
               onEditClick={() => setIsEditing(true)}
            />
         ) : (
            // 선택값이 없거나 수정하기 버튼 클릭 시
            <ChatWrapper>
               <div className="flex flex-col gap-2 lg:gap-4">
                  {selectOptions.map((option) => (
                     <button
                        type="button"
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={`hover:border-primary-blue-300 flex h-13 w-70 cursor-pointer items-center rounded-2xl border px-4 py-[14px] lg:h-21 lg:w-140 ${
                           selected === option.value
                              ? "border-primary-blue-300 bg-primary-blue-50"
                              : "border-line-200"
                        }`}
                     >
                        <Image
                           src={
                              selected === option.value
                                 ? CheckedIcon
                                 : UncheckedIcon
                           }
                           alt={`라디오 버튼 ${selected === option.value ? "선택됨" : "선택안됨"}`}
                           className="aspect-square w-6 lg:w-9"
                        />
                        <span className="ml-2 text-sm font-semibold lg:text-lg">
                           {option.label}
                        </span>
                     </button>
                  ))}
               </div>
               <SolidButton onClick={handleSubmit} disabled={!selected}>
                  선택완료
               </SolidButton>
            </ChatWrapper>
         )}
      </>
   );
}
