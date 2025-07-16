import { tokenFetch } from "../fetch-client";

export async function getFavoriteMovers(page = 1, limit = 6) {
   return tokenFetch(`/favorites/me?page=${page}&limit=${limit}`);
}
