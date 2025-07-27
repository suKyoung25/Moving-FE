import { tokenFetch } from "@/lib/utils";

export async function postClientConfirmedQuote(estimateId: string) {
   try {
      return await tokenFetch("/estimates/confirmed", {
         method: "POST",
         body: JSON.stringify({ estimateId }),
         headers: {
            "Content-Type": "application/json",
         },
      });
   } catch (e) {
      console.log(e);
      throw e;
   }
}
