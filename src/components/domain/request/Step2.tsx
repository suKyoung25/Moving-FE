"use client";

import React, { useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import ChatMessage from "./ChatMessage";
import ChatWrapper from "./ChatWrapper";
import "react-day-picker/style.css";
import { ko } from "react-day-picker/locale";
import { format } from "date-fns";
import { Request } from "@/lib/types";
import SolidButton from "@/components/common/SolidButton";

interface Step2Props {
   value?: Request["moveDate"];
   onChange: (val: Request["moveDate"]) => void;
   onNext: () => void;
}

// 이사 날짜 선택 단계
export default function Step2({ value, onChange, onNext }: Step2Props) {
   const [selected, setSelected] = useState<Request["moveDate"] | undefined>(
      value,
   );
   const [isEditing, setIsEditing] = useState<boolean>(false);

   const defaultClassNames = getDefaultClassNames();
   const isValidDate = selected && selected < new Date();

   const handleSelect = (date: Request["moveDate"]) => {
      setSelected(date);
   };

   const handleSubmit = () => {
      if (!selected || isValidDate) return;
      onChange(selected);
      if (!isEditing) onNext();
      else setIsEditing(false);
   };

   return (
      <>
         {/* 시스템 메시지 */}
         <ChatMessage type="system" message="이사 예정일을 선택해 주세요." />

         {/* 유저 메세지 */}
         {value && !isEditing ? (
            <ChatMessage
               type="user"
               message={format(value, "yyyy년 MM월 dd일")}
               onEditClick={() => setIsEditing(true)}
            />
         ) : (
            <>
               <ChatWrapper className="gap-6 rounded-tr-3xl p-[14px] lg:p-6">
                  {/* 날짜 선택용 달력 라이브러리 */}
                  <DayPicker
                     animate
                     mode="single"
                     selected={selected}
                     onSelect={handleSelect}
                     locale={ko}
                     navLayout="around"
                     showOutsideDays
                     required
                     classNames={{
                        day: `lg:px-5 lg:py-4`,
                        today: `font-bold text-primary-blue-300`,
                        selected: `[&>button]:!mx-auto [&>button]:!my-0 [&>button]:!bg-primary-blue-300 [&>button]:rounded-full [&>button]:!w-6 [&>button]:!h-6 lg:[&>button]:!w-10 lg:[&>button]:!h-10 !text-white`,
                        weekday: `text-gray-400 font-medium py-[10px]`,
                        outside: `text-gray-100`,
                        months: `max-w-fit`,
                        month_caption: `flex justify-center items-center px-[14px] py-3 text-base lg:text-xl font-semibold mb-2`,
                        root: `${defaultClassNames.root} text-sm lg:text-xl`,
                        chevron: `${defaultClassNames.chevron} !fill-gray-300`,
                     }}
                     formatters={{
                        formatCaption: (month, options) => {
                           return format(month, "yyyy. MM", {
                              locale: options?.locale,
                           });
                        },
                     }}
                     footer={
                        isValidDate && (
                           <div className="text-secondary-red-200 mt-2 mr-2 text-center font-medium">
                              오늘 이후 날짜를 선택해주세요
                           </div>
                        )
                     }
                  />
                  <SolidButton onClick={handleSubmit} disabled={isValidDate}>
                     선택완료
                  </SolidButton>
               </ChatWrapper>
               {isEditing && (
                  <button
                     type="button"
                     className="mr-2 text-right font-medium text-gray-500 underline max-lg:text-xs"
                     onClick={() => setIsEditing(false)}
                  >
                     수정취소
                  </button>
               )}
            </>
         )}
      </>
   );
}
