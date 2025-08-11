import { tokenFetch } from "@/lib/utils";

export async function fetchClientQuoteDetail(
   quoteId: string,
   targetLang?: string,
) {
   try {
      return await tokenFetch(
         `/estimates/client/${quoteId}?targetLang=${targetLang}`,
         { method: "GET" },
      );
   } catch (e) {
      throw e;
   }
}

export async function getEstimate(estimateId: string) {
   const res = await tokenFetch(`/estimates/${estimateId}`);
   return res?.data ?? null;
}
