import { useFormWizard } from "@/context/FormWizardContext";
import { FormWizardState } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { patchRequestDraft } from "./requests/requestDraftApi";

export function useSaveRequestDraft() {
   const { currentStep: draftStep } = useFormWizard();

   return useMutation({
      mutationFn: async ({
         state,
         currentStep,
      }: {
         state: FormWizardState;
         currentStep?: number;
      }) => {
         const saved = {
            ...state,
            fromAddress: state.fromAddress?.trim() || undefined,
            toAddress: state.toAddress?.trim() || undefined,
            currentStep: currentStep ?? draftStep,
         };
         return await patchRequestDraft(saved);
      },
      onError: (err) => {
         console.error("중간 저장 실패:", err);
      },
   });
}
