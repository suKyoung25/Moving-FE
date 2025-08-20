import { CreateReviewDto } from "@/lib/schemas";
import { tokenFetch } from "@/lib/utils";

export async function createReview(data: CreateReviewDto) {
   return await tokenFetch(`/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
   });
}
