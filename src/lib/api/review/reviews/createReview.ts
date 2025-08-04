import { CreateReviewDto } from "@/lib/schemas/reviews.schema";
import { tokenFetch } from "@/lib/utils/fetch-client";

export async function createReview(data: CreateReviewDto) {
   return await tokenFetch(`/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
   });
}
