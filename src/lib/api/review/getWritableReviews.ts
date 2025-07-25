import { tokenFetch } from "@/lib/utils/fetch-client";

export async function getWritableReviews(page = 1, limit = 6) {
   return await tokenFetch(`/reviews/writable?page=${page}&limit=${limit}`, {
      method: "GET",
   });
}
