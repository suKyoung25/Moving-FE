import { tokenFetch } from "@/lib/utils";

export async function fetchClientQuoteDetail(quoteId: string) {
   try {
      return await tokenFetch(`/estimates/client/${quoteId}`, {
         method: "GET",
      });
   } catch (e) {
      throw e;
   }
}

export async function getEstimate(estimateId: string) {
   const res = await tokenFetch(`/estimates/${estimateId}`);
   return res?.data ?? null;
}
