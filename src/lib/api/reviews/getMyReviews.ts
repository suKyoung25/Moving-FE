import { tokenFetch } from "../fetch-client";

export async function getMyReviews(page = 1, limit = 6) {
   return tokenFetch(`/reviews/me?page=${page}&limit=${limit}`);
}
