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
   const [isModal, setIsModal] = useState<boolean>(false);
   const router = useRouter();

   const handleClickConfirmed = async (estimateId: string) => {
      try {
         const result = await postClientConfirmedQuote(estimateId);

         setIsModal(true);
         router.push("/ko/my-quotes/client?tab=2");
         return result;
      } catch (e) {
         throw e;
      }
   };

   if (isModal) return <ToastPopup>견적이 확정되었습니다</ToastPopup>;

   return (
      <SolidButton onClick={() => handleClickConfirmed(estimateId)}>
         견적 확정하기
      </SolidButton>
   );
}
