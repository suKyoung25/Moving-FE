import { tokenFetch } from "@/lib/utils/fetch-client";

export async function getMyReviews(page = 1, limit = 6, targetLang?: string) {
   return await tokenFetch(
      `/reviews/me?targetLang=${targetLang}&page=${page}&limit=${limit}`,
      {
         method: "GET",
      },
   );
}
