import { tokenFetch } from "@/lib/utils";

export async function fetchClientReceivedQuotes(category: string) {
   try {
      return await tokenFetch(`/estimates/received?category=${category}`, {
         method: "GET",
      });
   } catch (e) {
      throw e;
   }
}
