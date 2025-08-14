import { tokenFetch } from "@/lib/utils";
import { delay } from "../../../../delay";

export async function fetchClientQuoteDetail(
   quoteId: string,
   targetLang?: string,
) {
   try {
      await delay(2000);
      return await tokenFetch(
         `/estimates/client/${quoteId}?targetLang=${targetLang}`,
         { method: "GET" },
      );
   } catch (e) {
      throw e;
   }
}

export async function getEstimate(estimateId: string, targetLang?: string) {
   const res = await tokenFetch(
      `/estimates/${estimateId}?targetLang=${targetLang}`,
   );
   return res?.data ?? null;
}
