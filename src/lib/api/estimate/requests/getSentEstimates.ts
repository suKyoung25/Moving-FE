import { tokenFetch } from "@/lib/utils";
import { delay } from "../../../../../delay";

export async function getSentEstimates(page: number = 1, targetLang?: string) {
   await delay(500);

   const res = await tokenFetch(
      `/estimates/sent?targetLang=${targetLang}&page=${page}`,
      {
         method: "GET",
         cache: "no-store",
      },
   );

   return res;
}
