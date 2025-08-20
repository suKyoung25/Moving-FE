"use client";

import SolidButton from "@/components/common/SolidButton";
import { useToast } from "@/context/ToastContext";
import { postClientConfirmedQuote } from "@/lib/api/estimate/requests/postClientConfirmedQuote";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function ConfirmedButton({
   estimateId,
}: {
   estimateId: string;
}) {
   const t = useTranslations("MyQuotes.Client.Detail");

   const { showSuccess, showError } = useToast();
   const queryClient = useQueryClient();

   const handleClickConfirmed = async (estimateId: string) => {
      try {
         await postClientConfirmedQuote(estimateId);
         showSuccess(t("toast.confirmed"));
         queryClient.invalidateQueries({ queryKey: ["pendingEstimates"] });
      } catch (e) {
         showError(t("toast.confirmFailed"));
         console.error(e);
      }
   };

   return (
      <SolidButton onClick={() => handleClickConfirmed(estimateId)}>
         {t("button.confirmEstimate")}
      </SolidButton>
   );
}
