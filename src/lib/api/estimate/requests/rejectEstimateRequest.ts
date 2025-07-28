import { RejectEstimateParams } from "@/lib/types";
import { tokenFetch } from "@/lib/utils";

export async function rejectEstimateRequest(params: RejectEstimateParams) {
   return await tokenFetch("/estimates/reject", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
         "Content-Type": "application/json",
      },
   });
}
