"use server";

import { getMyReviews } from "@/lib/api/reviews/getMyReviews";

export async function gerMyReviewsAction(page = 1, limit = 6) {
   return getMyReviews(page, limit);
}
