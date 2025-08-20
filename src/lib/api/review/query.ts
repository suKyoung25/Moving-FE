import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MyReviewsResponse, WritableReviewsResponse } from "@/lib/types";
import { getWritableReviews } from "./requests/getWritableReviews";
import { getMyReviews } from "./requests/getMyReviews";

interface UseReviewsParams {
   page: number;
   limit: number;
   targetLang?: string;
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

export function useMyReviews({ page, limit, targetLang }: UseReviewsParams) {
   return useQuery<MyReviewsResponse>({
      queryKey: ["myReviews", page, limit, targetLang],
      queryFn: () => getMyReviews(page, limit, targetLang),
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
   });
}
