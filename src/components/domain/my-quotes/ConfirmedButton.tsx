"use client";

import SolidButton from "@/components/common/SolidButton";
import ToastPopup from "@/components/common/ToastPopup";
import { postClientConfirmedQuote } from "@/lib/api/estimate/postClientConfirmedQuote";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConfirmedButton({
   estimateId,
}: {
   estimateId: string;
}) {
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
            text: "견적이 확정되었습니다",
            success: true,
         });

         router.refresh();
      } catch (e) {
         setToast({
            id: Date.now(),
            text: "견적 확정에 실패했습니다",
            success: false,
         });
         console.error(e);
      }
   };

   return (
      <>
         <SolidButton onClick={() => handleClickConfirmed(estimateId)}>
            견적 확정하기
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
