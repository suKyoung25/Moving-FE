import { tokenFetch } from "@/lib/utils";

export async function deleteReview(reviewId: string) {
   return await tokenFetch(`/reviews/${reviewId}`, { method: "DELETE" });
}
