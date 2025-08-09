"use client";

import React, { useState } from "react";
import { Request } from "@/lib/types";
import ChatMessage from "./ChatMessage";
import ChatWrapper from "./ChatWrapper";
import Image from "next/image";
import chekcedIcon from "@/assets/images/roundActiveIcon.svg";
import uncheckedIcon from "@/assets/images/roundDefaultIcon.svg";
import SolidButton from "@/components/common/SolidButton";
import { useTranslations } from "next-intl";

interface Step1Props {
   value?: Request["moveType"];
   onChange: (val: Request["moveType"]) => void;
   onNext: () => void;
}

// 이사 종류 선택 단계
export default function Step1({ value, onChange, onNext }: Step1Props) {
   const t = useTranslations("Request");

   const [selected, setSelected] = useState<Request["moveType"] | undefined>(
      value,
   );
   const [isEditing, setIsEditing] = useState<boolean>(false);

   const selectOptions = [
      { label: t("moveTypes.SMALL"), value: "SMALL" },
      { label: t("moveTypes.HOME"), value: "HOME" },
      { label: t("moveTypes.OFFICE"), value: "OFFICE" },
   ] as const;

   const selectedLabel = selectOptions.find(
      (option) => option.value === value,
   )?.label;

   const handleSelect = (type: Request["moveType"]) => {
      setSelected(type);
   };

   const handleSubmit = () => {
      if (!selected) return;
      onChange(selected);
      if (!isEditing) onNext();
      else setIsEditing(false);
   };

   return (
      <>
         {/* 시스템 메시지 */}
         <ChatMessage type="system" message={t("selectMoveTypePrompt")} />

         {/* 유저 메세지 */}
         {value && !isEditing ? ( // 선택 완료 시
            <ChatMessage
               type="user"
               message={selectedLabel ?? ""}
               onEditClick={() => setIsEditing(true)}
            />
         ) : (
            // 선택값이 없거나 수정하기 버튼 클릭 시
            <>
               <ChatWrapper>
                  <div className="flex flex-col gap-2 lg:gap-4">
                     {selectOptions.map((option) => (
                        <button
                           type="button"
                           key={option.value}
                           onClick={() => handleSelect(option.value)}
                           className={`hover:border-primary-blue-300 flex h-13 w-full items-center rounded-2xl border px-4 py-3.5 text-left break-keep lg:h-21 lg:w-140 ${
                              selected === option.value
                                 ? "border-primary-blue-300 bg-primary-blue-50"
                                 : "border-line-200"
                           }`}
                        >
                           <Image
                              src={
                                 selected === option.value
                                    ? chekcedIcon
                                    : uncheckedIcon
                              }
                              alt={t(
                                 selected === option.value
                                    ? "radioSelectedAlt"
                                    : "radioUnselectedAlt",
                              )}
                              className="aspect-square w-6 lg:w-9"
                           />
                           <span className="text-14-semibold lg:text-18-semibold ml-2">
                              {option.label}
                           </span>
                        </button>
                     ))}
                  </div>

                  <SolidButton onClick={handleSubmit} disabled={!selected}>
                     {t("completeSelection")}
                  </SolidButton>
               </ChatWrapper>
               {isEditing && (
                  <button
                     type="button"
                     className="text-16-semibold max-lg:text-12-medium mr-2 text-right text-gray-500 underline"
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
