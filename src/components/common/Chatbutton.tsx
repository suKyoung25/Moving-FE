// src/components/common/ChatButton.tsx
import { useTranslations } from "next-intl";
import React from "react";
import { SiImessage } from "react-icons/si";

interface ChatButtonProps {
   onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function ChatButton({ onClick }: ChatButtonProps) {
   const t = useTranslations("MoverSearch");
   return (
      <button type="button" onClick={onClick} className="group relative">
         <div className="tooltip !-left-1/2 lg:!-left-0">
            {t("chatButton.tooltip")}
         </div>
         <SiImessage size={24} className="text-primary-blue-300 lg:size-7.5" />
      </button>
   );
}
