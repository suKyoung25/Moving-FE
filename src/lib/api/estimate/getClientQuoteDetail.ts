import { tokenFetch } from "@/lib/utils";

export async function fetchClientQuoteDetail(quoteId: string) {
   try {
      return await tokenFetch(`/estimates/${quoteId}`, { method: "GET" });
   } catch (e) {
      throw e;
   }
}
