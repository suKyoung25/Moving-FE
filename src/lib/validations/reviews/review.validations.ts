import {
   createReviewSchema,
   CreateReviewDto,
   updateReviewSchema,
} from "./review.schemas";

// createReview 유효성검사
export function validateCreateReview(data: unknown): {
   valid: boolean;
   message?: string;
} {
   const result = createReviewSchema.safeParse(data);
   if (result.success) return { valid: true };
   return {
      valid: false,
      message: result.error.errors[0]?.message ?? "유효성 검사 오류",
   };
}

// updateReview 유효성검사
export function validateUpdateReview(data: unknown): {
   valid: boolean;
   message?: string;
} {
   const result = updateReviewSchema.safeParse(data);
   if (result.success) return { valid: true };
   return {
      valid: false,
      message: result.error.errors[0]?.message ?? "유효성 검사 오류",
   };
}

// formData → createReview payload 변환
export function getCreateReviewPayloadFromForm(
   formData: FormData,
): CreateReviewDto {
   return {
      estimateId: formData.get("estimateId")?.toString() ?? "",
      rating: Number(formData.get("rating")),
      content: formData.get("content")?.toString() ?? "",
   };
}
