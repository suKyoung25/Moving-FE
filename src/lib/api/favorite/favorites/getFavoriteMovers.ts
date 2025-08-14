import { tokenFetch } from "@/lib/utils/fetch-client";
import { delay } from "../../../../../delay";

export async function getFavoriteMovers(page = 1, limit = 6) {
   await delay(2000);
   return await tokenFetch(`/favorites/me?page=${page}&limit=${limit}`, {
      method: "GET",
   });
}
