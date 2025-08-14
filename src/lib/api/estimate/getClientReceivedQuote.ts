import { tokenFetch } from "@/lib/utils";
import { delay } from "../../../../delay";

export async function fetchClientReceivedQuotes(
   category: string,
   page: number,
   targetLang?: string,
) {
   await delay(1000);
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
