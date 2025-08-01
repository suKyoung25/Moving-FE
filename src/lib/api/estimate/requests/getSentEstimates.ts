import { tokenFetch } from "@/lib/utils";
import { delay } from "../../../../../delay";

export async function getSentEstimates(page: number = 1) {
   await delay(500);

   const res = await tokenFetch(`/estimates/sent?page=${page}`, {
      method: "GET",
      cache: "no-store",
   });

   return res;
}
