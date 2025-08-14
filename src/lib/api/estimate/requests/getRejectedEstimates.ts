import { tokenFetch } from "@/lib/utils";
import { delay } from "../../../../../delay";

export async function getRejectedEstimates(page = 1, targetLang?: string) {
   await delay(500);
   const data = await tokenFetch(
      `/estimates/rejected?targetLang=${targetLang}&page=${page}`,
      {
         method: "GET",
         cache: "no-store",
      },
   );
   return data;
}
