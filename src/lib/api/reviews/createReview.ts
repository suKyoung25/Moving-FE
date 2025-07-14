import { CreateReviewDto } from "@/lib/validations/reviews/review.schema";
import { tokenFetch } from "../fetch-client";

export async function createReview(data: CreateReviewDto) {
   return tokenFetch("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
   });
}
