import { z } from "zod";

export interface ReviewValidationMessages {
   invalidRequest: string;
   selectRating: string;
   maxRating: string;
   minContent: string;
}

// 리뷰 생성 스키마 생성 함수
export function createReviewSchema(messages: ReviewValidationMessages) {
   return z.object({
      estimateId: z.string().uuid(messages.invalidRequest),
      rating: z
         .number()
         .int()
         .min(1, messages.selectRating)
         .max(5, messages.maxRating),
      content: z.string().min(10, messages.minContent),
   });
}

// 리뷰 수정 스키마 생성 함수
export function updateReviewSchema(messages: ReviewValidationMessages) {
   return z.object({
      rating: z
         .number()
         .int()
         .min(1, messages.selectRating)
         .max(5, messages.maxRating),
      content: z.string().min(10, messages.minContent),
   });
}

// 타입 편의 정의
export type CreateReviewDto = z.infer<ReturnType<typeof createReviewSchema>>;
export type UpdateReviewDto = z.infer<ReturnType<typeof updateReviewSchema>>;
