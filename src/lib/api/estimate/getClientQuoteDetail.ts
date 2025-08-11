import { tokenFetch } from "@/lib/utils";

export async function fetchClientQuoteDetail(
   quoteId: string,
   targetLang?: string,
) {
   try {
      return await tokenFetch(
         `/estimates/${quoteId}?targetLang=${targetLang}`,
         { method: "GET" },
      );
   } catch (e) {
      throw e;
   }
}
