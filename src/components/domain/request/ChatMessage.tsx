"use client";

import { useTranslations } from "next-intl";
import React from "react";

interface ChatMessageProps {
   message: string;
   type: "system" | "user";
   children?: React.ReactNode;
   onEditClick?: () => void;
}

// 시스템/유저 채팅 메세지 UI
export default function ChatMessage({
   message,
   type,
   children,
   onEditClick,
}: ChatMessageProps) {
   const t = useTranslations("Request");

   const baseStyle =
      "w-fit h-fit px-5 py-3 text-sm font-medium max-lg:max-w-62 lg:px-10 lg:py-5 lg:text-lg";

   // 시스템 메세지
   if (type === "system") {
      return (
         <div
            className={`${baseStyle} text-black-400 rounded-r-3xl rounded-bl-3xl bg-white`}
         >
            {message}
            {children}
         </div>
      );
   }

   // 유저 메세지 (선택 완료 단계)
   return (
      <div className="flex flex-col items-end gap-2 self-end">
         <div
            className={`${baseStyle} bg-primary-blue-300 rounded-l-3xl rounded-br-3xl text-white`}
         >
            {message}
         </div>
         <button
            className="mr-2 font-medium text-gray-500 underline max-lg:text-xs"
            onClick={onEditClick}
         >
            {t("edit")}
         </button>
      </div>
   );
}
