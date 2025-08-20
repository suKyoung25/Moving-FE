import { tokenFetch } from "@/lib/utils";
import { delay } from "../../../../../delay";

export async function getWritableReviews(page = 1, limit = 6) {
   await delay(2000);
   return await tokenFetch(`/reviews/writable?page=${page}&limit=${limit}`, {
      method: "GET",
   });
}
