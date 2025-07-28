import { useTranslations } from "next-intl";
import { createReviewSchema, updateReviewSchema } from "../schemas";

export function useValidationSchema() {
   const t = useTranslations("Validations");

   const messages = {
      invalidRequest: t("invalidRequest") || "잘못된 요청입니다.",
      selectRating: t("selectRating") || "별점을 선택해주세요.",
      maxRating: t("maxRating") || "5점 만점 입니다.",
      minContent:
         t("minContent") || "리뷰 내용을 최소 10자 이상 입력해 주세요.",
   };

   return {
      createSchema: createReviewSchema(messages),
      updateSchema: updateReviewSchema(messages),
   };
}
