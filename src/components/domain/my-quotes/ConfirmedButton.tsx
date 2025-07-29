"use client";

import SolidButton from "@/components/common/SolidButton";
import { postClientConfirmedQuote } from "@/lib/api/estimate/postClientConfirmedQuote";
import { useRouter } from "next/navigation";

export default function ConfirmedButton({
   estimateId,
}: {
   estimateId: string;
}) {
   const router = useRouter();

   const handleClickConfirmed = async (estimateId: string) => {
      try {
         const result = await postClientConfirmedQuote(estimateId);

         alert("견적이 확정되었습니다");
         router.push("/ko/my-quotes/client?tab=2");
         return result;
      } catch (e) {
         throw e;
      }
   };

   return (
      <SolidButton onClick={() => handleClickConfirmed(estimateId)}>
         견적 확정하기
      </SolidButton>
   );
}
