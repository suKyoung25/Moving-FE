import { tokenFetch } from "@/lib/utils";

export async function fetchClientPendingQuotes(page: number) {
   try {
      return await tokenFetch(`/estimates/pending?offset=${page}&limit=6`, {
         method: "GET",
      });
   } catch (e) {
      throw e;
   }
}
