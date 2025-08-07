"use client";

import SolidButton from "@/components/common/SolidButton";
import ToastPopup from "@/components/common/ToastPopup";
import { postClientConfirmedQuote } from "@/lib/api/estimate/postClientConfirmedQuote";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConfirmedButton({
   estimateId,
}: {
   estimateId: string;
}) {
   const t = useTranslations("MyQuotes.Client.Detail");

   const [toast, setToast] = useState<{
      id: number;
      text: string;
      success: boolean;
   } | null>(null);

   const router = useRouter();

   const handleClickConfirmed = async (estimateId: string) => {
      try {
         await postClientConfirmedQuote(estimateId);

         setToast({
            id: Date.now(),
            text: t("toast.confirmed"),
            success: true,
         });

         // TODO: 토스트 알림 안뜸
         setTimeout(() => {
            setToast(null);
            router.refresh();
         }, 2000);
      } catch (e) {
         setToast({
            id: Date.now(),
            text: t("toast.confirmFailed"),
            success: false,
         });
         console.error(e);
      }
   };

   return (
      <>
         <SolidButton onClick={() => handleClickConfirmed(estimateId)}>
            {t("button.confirmEstimate")}
         </SolidButton>

         {toast && (
            <ToastPopup
               key={toast.id}
               text={toast.text}
               success={toast.success}
            />
         )}
      </>
   );
}
