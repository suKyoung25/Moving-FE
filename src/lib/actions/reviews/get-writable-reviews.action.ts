"use server";

import { getWritableReviews } from "@/lib/api/reviews/getWritableReviews";

export async function getWritableReviewsAction(page = 1, limit = 6) {
   return getWritableReviews(page, limit);
}
