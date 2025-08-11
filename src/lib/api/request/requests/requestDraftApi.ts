import { FormWizardState } from "@/lib/types";
import { tokenFetch } from "@/lib/utils";

// 견적 요청 중간 상태 조회
export async function getRequestDraft(targetLang?: string) {
   return await tokenFetch(`/requests/draft?targetLang=${targetLang}`);
}

// 견적 요청 중간 상태 저장/업데이트
export async function patchRequestDraft(
   data: FormWizardState & { currentStep: number },
) {
   return await tokenFetch("/requests/draft", {
      method: "PATCH",
      body: JSON.stringify(data),
   });
}
