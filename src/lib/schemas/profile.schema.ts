import { useTranslations } from "next-intl";
import z from "zod";

export function useMoverProfileSchemas() {
   const t = useTranslations("Validations");

   //기사님 프로필 관련 사용 (career가 string)
   const moverProfileSchema = z.object({
      image: z.union([z.string(), z.instanceof(File)]).optional(), //이미지 타입 string | File
      nickName: z.string().min(2, t("nickNameMin")).max(10, t("nickNameMax")),
      career: z
         .string()
         .min(1, t("careerRequired")) // 빈 문자열인지 체크 (처음부터 숫자로 하면 빈문자열을 0으로 인식함)
         .max(2, t("careerMax"))
         .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: t("careerMinZero"),
         }),
      introduction: z
         .string()
         .min(8, t("introductionMin"))
         .max(100, t("introductionMax")),
      description: z
         .string()
         .min(10, t("descriptionMin"))
         .max(100, t("descriptionMax")),
      serviceType: z.array(z.string().min(1)).min(1, t("selectAtLeastOne")),
      serviceArea: z.array(z.string().min(1)).min(1, t("selectAtLeastOne")),
   });

   // 기사님 프로필 관련 API 전송용 타입 (career가 number)
   const moverProfileRequestSchema = z.object({
      image: z.union([z.string(), z.instanceof(File)]).optional(), // 이미지 타입 string | File
      nickName: z.string(),
      career: z.number().min(0, t("careerMinZero")).max(99, t("careerMax")),
      introduction: z.string(),
      description: z.string(),
      serviceType: z.array(z.string()),
      serviceArea: z.array(z.string()),
   });

   return {
      moverProfileSchema,
      moverProfileRequestSchema,
   };
}

export type MoverProfileInput = z.infer<
   ReturnType<typeof useMoverProfileSchemas>["moverProfileSchema"]
>;
export type MoverProfileRequestInput = z.infer<
   ReturnType<typeof useMoverProfileSchemas>["moverProfileRequestSchema"]
>;
