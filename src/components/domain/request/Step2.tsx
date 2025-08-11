"use client";

import React, { useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import ChatMessage from "./ChatMessage";
import ChatWrapper from "./ChatWrapper";
import "react-day-picker/style.css";
import { enUS, ko, zhCN } from "react-day-picker/locale";
import { format } from "date-fns";
import type { Locale as DateFnsLocale } from "date-fns";
import { Request } from "@/lib/types";
import SolidButton from "@/components/common/SolidButton";
import { useLocale, useTranslations } from "next-intl";

interface Step2Props {
   value?: Request["moveDate"];
   onChange: (val: Request["moveDate"]) => void;
   onNext: () => void;
}

const localeMap: Record<string, DateFnsLocale> = {
   ko: ko,
   en: enUS,
   zh: zhCN,
};

// 이사 날짜 선택 단계
export default function Step2({ value, onChange, onNext }: Step2Props) {
   const t = useTranslations("Request");
   const locale = useLocale();

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
         <ChatMessage type="system" message={t("selectMoveDatePrompt")} />

         {/* 유저 메세지 */}
         {value && !isEditing ? (
            <ChatMessage
               type="user"
               message={format(value, "yyyy년 MM월 dd일")}
               onEditClick={() => setIsEditing(true)}
            />
         ) : (
            <>
               <ChatWrapper className="gap-6 rounded-tr-3xl p-3.5 lg:p-6">
                  {/* 날짜 선택용 달력 라이브러리 */}
                  <DayPicker
                     animate
                     mode="single"
                     selected={selected}
                     onSelect={handleSelect}
                     locale={localeMap[locale] || ko}
                     navLayout="around"
                     showOutsideDays
                     required
                     classNames={{
                        day: `lg:px-5 lg:py-4`,
                        today: `font-bold text-primary-blue-300`,
                        selected: `[&>button]:!mx-auto [&>button]:!my-0 [&>button]:!bg-primary-blue-300 [&>button]:rounded-full [&>button]:!w-6 [&>button]:!h-6 lg:[&>button]:!w-10 lg:[&>button]:!h-10 !text-white`,
                        weekday: `text-gray-400 font-medium py-2.5`,
                        outside: `text-gray-100`,
                        months: `max-w-fit`,
                        month_caption: `flex justify-center items-center px-[14px] py-3 text-16-semibold lg:text-20-semibold mb-2`,
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
                              {t("selectFutureDateWarning")}
                           </div>
                        )
                     }
                  />
                  <SolidButton onClick={handleSubmit} disabled={isValidDate}>
                     {t("completeSelection")}
                  </SolidButton>
               </ChatWrapper>
               {isEditing && (
                  <button
                     type="button"
                     className="max-lg:text-12-medium text-16-medium mr-2 text-right text-gray-500 underline"
                     onClick={() => setIsEditing(false)}
                  >
                     {t("cancelEdit")}
                  </button>
               )}
            </>
         )}
      </>
   );
}
