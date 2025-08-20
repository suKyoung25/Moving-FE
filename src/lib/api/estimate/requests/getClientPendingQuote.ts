import { tokenFetch } from "@/lib/utils";
import { delay } from "../../../../../delay";

export async function fetchClientPendingQuotes(
   page: number,
   targetLang?: string,
) {
   try {
      await delay(2000);
      const offset = (page - 1) * 6;
      return await tokenFetch(
         `/estimates/pending?targetLang=${targetLang}&offset=${offset}&limit=6`,
         {
            method: "GET",
         },
      );
   } catch (e) {
      throw e;
   }
}
