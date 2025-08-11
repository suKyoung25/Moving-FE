import { useTranslations } from "next-intl";
import React from "react";
import { FiCheckSquare } from "react-icons/fi";

interface ReadAllButtonProps {
   onClick: () => void;
}

export default function ReadAllButton({ onClick }: ReadAllButtonProps) {
   const t = useTranslations("Notification");

   return (
      <button
         type="button"
         onClick={onClick}
         className="group relative"
         aria-label={t("readAllAria")}
      >
         <div className="tooltip">{t("readAllTooltip")}</div>
         <FiCheckSquare className="text-gray-500" />
      </button>
   );
}
