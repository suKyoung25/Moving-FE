import { z } from "zod";

// 리뷰 생성
export const createReviewSchema = z.object({
   estimateId: z.string().uuid({ message: "잘못된 요청입니다." }),
   rating: z
      .number()
      .int()
      .min(1, "별점을 선택해주세요.")
      .max(5, "5점 만점 입니다."),
   content: z.string().min(10, "리뷰 내용을 최소 10자 이상 입력해 주세요."),
});

// 리뷰 수정
export const updateReviewSchema = z.object({
   rating: z.number().int().min(1).max(5).optional(),
   content: z.string().min(1).optional(),
});

// 리뷰 ID 파라미터
export const reviewIdParamsSchema = z.object({
   reviewId: z.string().uuid({ message: "잘못된 요청입니다." }),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
export type UpdateReviewDto = z.infer<typeof updateReviewSchema>;
export type ReviewIdParamsDto = z.infer<typeof reviewIdParamsSchema>;
