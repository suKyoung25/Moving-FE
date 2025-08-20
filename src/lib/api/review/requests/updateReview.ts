import { UpdateReviewDto } from "@/lib/schemas";
import { tokenFetch } from "@/lib/utils";

export async function updateReview({
   reviewId,
   ...data
}: { reviewId: string } & UpdateReviewDto) {
   return await tokenFetch(`/reviews/${reviewId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
   });
}
