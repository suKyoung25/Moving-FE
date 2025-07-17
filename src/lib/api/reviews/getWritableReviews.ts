import { tokenFetch } from "../fetch-client";

export async function getWritableReviews(page = 1, limit = 6) {
   return await tokenFetch(
      `/estimates/writable/me?page=${page}&limit=${limit}`,
      {
         method: "GET",
      },
   );
}
