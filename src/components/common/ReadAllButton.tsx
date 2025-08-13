import { useTranslations } from "next-intl";
import React from "react";
import { FiCheckSquare } from "react-icons/fi";

interface ReadAllButtonProps {
   onClick: () => void;
   tooltipClass?: string;
}

export default function ReadAllButton({
   onClick,
   tooltipClass,
}: ReadAllButtonProps) {
   const t = useTranslations("Notification");

   return (
      <button
         type="button"
         onClick={onClick}
         className="group relative"
         aria-label={t("readAllAria")}
      >
         <div className={`tooltip ${tooltipClass ?? ""}`}>
            {t("readAllTooltip")}
         </div>

         <FiCheckSquare className="text-gray-500" />
      </button>
   );
}
