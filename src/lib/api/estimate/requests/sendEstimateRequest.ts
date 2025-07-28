import { SendEstimateParams } from "@/lib/types";
import { tokenFetch } from "@/lib/utils";

export async function sendEstimateRequest(params: SendEstimateParams) {
   return await tokenFetch("/estimates/create", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
         "Content-Type": "application/json",
      },
   });
}
