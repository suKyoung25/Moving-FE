import { tokenFetch } from "@/lib/utils";

export async function fetchClientPendingQuotes(page: number) {
   try {
      const offset = (page - 1) * 6;
      return await tokenFetch(`/estimates/pending?offset=${offset}&limit=6`, {
         method: "GET",
      });
   } catch (e) {
      throw e;
   }
}
