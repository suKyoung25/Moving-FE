"use client";

import { useTranslations } from "next-intl";

interface NoRequestModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
}

export function NoRequestModal({
   isOpen,
   onClose,
   onConfirm,
}: NoRequestModalProps) {
   const t = useTranslations("MoverDetail");

   if (!isOpen) return null;

   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center"
         style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
         onClick={(e) => {
            if (e.target === e.currentTarget) {
               onClose();
            }
         }}
      >
         <div className="mx-4 w-80 max-w-[90vw] overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="p-6 text-center">
               <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  {t("designatedEstimateRequestTitle")}
               </h3>
               <p className="mb-6 text-sm text-gray-900">
                  {t("generalEstimateFirst")}
               </p>

               <button
                  onClick={onConfirm}
                  className="w-full rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600"
               >
                  {t("requestGeneralEstimateButton")}
               </button>
            </div>
         </div>
      </div>
   );
}
