import { tokenFetch } from "@/lib/utils";

export async function fetchClientReceivedQuotes(
   category: string,
   page: number,
   targetLang?: string,
) {
   try {
      return await tokenFetch(
         `/estimates/received?targetLang=${targetLang}&category=${category}&page=${page}&limit=6`,
         {
            method: "GET",
         },
      );
   } catch (e) {
      throw e;
   }
}
