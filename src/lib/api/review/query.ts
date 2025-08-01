import { useQuery } from "@tanstack/react-query";
import { MyReviewsResponse, WritableReviewsResponse } from "@/lib/types";
import { getWritableReviews } from "./reviews/getWritableReviews";
import { getMyReviews } from "./reviews/getMyReviews";

interface UseReviewsParams {
   page: number;
   limit: number;
}

export function useWritableReviews({ page, limit }: UseReviewsParams) {
   return useQuery<WritableReviewsResponse>({
      queryKey: ["writableReviews", page, limit],
      queryFn: () => getWritableReviews(page, limit),
      placeholderData: (prev) => prev,
   });
}

export function useMyReviews({ page, limit }: UseReviewsParams) {
   return useQuery<MyReviewsResponse>({
      queryKey: ["myReviews", page, limit],
      queryFn: () => getMyReviews(page, limit),
      placeholderData: (prev) => prev,
   });
}
