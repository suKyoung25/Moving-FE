import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: 1000 * 60 * 60,
   });
}

export function useMyReviews({ page, limit }: UseReviewsParams) {
   return useQuery<MyReviewsResponse>({
      queryKey: ["myReviews", page, limit],
      queryFn: () => getMyReviews(page, limit),
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
   });
}
