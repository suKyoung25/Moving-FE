"use server";

import { createReview } from "@/lib/api/reviews/createReview";
import { CreateReviewDto } from "@/lib/validations/reviews/review.schema";

export async function createReviewAction(data: CreateReviewDto) {
   return createReview(data);
}
