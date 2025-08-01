import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "@/lib/api/review/reviews/createReview";
import { CreateReviewDto, UpdateReviewDto } from "@/lib/schemas/reviews.schema";
import { updateReview } from "./reviews/updateReview";
import { deleteReview } from "./reviews/deleteReview";

interface UseReviewParams {
   onSuccess?: () => void;
   onError?: (error: unknown) => void;
}

export function useCreateReview({ onSuccess, onError }: UseReviewParams) {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (data: CreateReviewDto) => createReview(data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["writableReviews"] });
         if (onSuccess) onSuccess();
      },
      onError: (error) => {
         if (onError) onError(error);
      },
   });
}

export function useUpdateReview({ onSuccess, onError }: UseReviewParams) {
   return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateReviewDto }) =>
         updateReview(id, data),
      onSuccess: () => {
         onSuccess?.();
      },
      onError: (error) => {
         onError?.(error);
      },
   });
}

export function useDeleteReview({ onSuccess, onError }: UseReviewParams) {
   return useMutation({
      mutationFn: (id: string) => deleteReview(id),
      onSuccess: () => {
         onSuccess?.();
      },
      onError: (error) => {
         onError?.(error);
      },
   });
}
