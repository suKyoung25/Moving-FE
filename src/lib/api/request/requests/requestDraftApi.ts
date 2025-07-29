import { FormWizardState } from "@/lib/types";
import { tokenFetch } from "@/lib/utils";

// 견적 요청 중간 상태 조회
export async function getRequestDraft() {
   try {
      const res = await tokenFetch("/requests/draft");
      return await res;
   } catch (err: unknown) {
      if (
         typeof err === "object" &&
         err !== null &&
         "response" in err &&
         typeof (err as any).response?.status === "number" &&
         (err as any).response.status === 404
      ) {
         return undefined;
      }
      throw err;
   }
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
