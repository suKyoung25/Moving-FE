import { z } from "zod";
import { useTranslations } from "next-intl";

export function useReviewSchemas() {
   const t = useTranslations("Validations");

   // 리뷰 생성 스키마
   const createReviewSchema = z.object({
      estimateId: z.string().uuid(t("invalidRequest")),
      rating: z.number().int().min(1, t("selectRating")).max(5, t("maxRating")),
      content: z.string().min(10, t("minContent")),
   });

   // 리뷰 수정 스키마
   const updateReviewSchema = z.object({
      rating: z.number().int().min(1, t("selectRating")).max(5, t("maxRating")),
      content: z.string().min(10, t("minContent")),
   });

   return {
      createReviewSchema,
      updateReviewSchema,
   };
}

// 타입 정의
export type CreateReviewDto = z.infer<
   ReturnType<typeof useReviewSchemas>["createReviewSchema"]
>;
export type UpdateReviewDto = z.infer<
   ReturnType<typeof useReviewSchemas>["updateReviewSchema"]
>;
