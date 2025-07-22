"use client";

import React from "react";

// props
interface Props {
   children: React.ReactNode;
   category?: "서비스" | "지역";
   isSelected: boolean;
   onClick: () => void;
   name?: string;
   value?: string;
}

export default function ProfileFieldButton({
   children,
   category,
   isSelected,
   onClick,
   name,
   value,
}: Props) {
   // 스타일
   const commonStyle =
      "text-14-medium lg:text-18-regular h-9 lg:h-12.5 rounded-[100px] border px-3 py-1.5 text-nowrap";
   const selectedStyle = isSelected
      ? "bg-primary-blue-50 border-bg-primary-blue-300 text-primary-blue-300"
      : "bg-bg-100 text-primary-blue-400 border-gray-100";

   return (
      <>
         {/* UI */}
         {category === "서비스" && (
            <button
               type="button"
               onClick={onClick}
               className={`${commonStyle} ${selectedStyle} mr-1.5 mb-5 lg:mr-3 lg:mb-8 lg:h-11.5`}
            >
               {children}
            </button>
         )}

         {category === "지역" && (
            <button
               type="button"
               onClick={onClick}
               className={`${commonStyle} ${selectedStyle} w-12.5 lg:w-18`}
            >
               {children}
            </button>
         )}

         {/* 실제로 선택되는 것 */}
         {isSelected && name && value && (
            <input type="hidden" name={name} value={value} />
         )}
      </>
   );
}
