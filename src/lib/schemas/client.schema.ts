import z from "zod";
import { useTranslations } from "next-intl";
import { useAuthSchemas } from "./auth.schema";

export function useClientProfileSchemas() {
   const t = useTranslations("Validations");
   const { nameSchema, phoneSchema } = useAuthSchemas();

   // ✅ 개별 스키마
   const profileImageSchema = z
      .union([z.string(), z.instanceof(File)])
      .optional();

   const serviceTypeSchema = z
      .array(z.enum(["SMALL", "HOME", "OFFICE"]))
      .min(1, t("selectServiceType"));

   const livingAreaSchema = z
      .array(z.string())
      .min(1, t("selectLivingArea"))
      .max(5, t("maxLivingArea"));

   const passwordSchema = z
      .string()
      .min(8, t("passwordMin"))
      .max(16, t("passwordMax"))
      .regex(
         /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,16}$/,
         t("passwordPattern"),
      )
      .optional();

   // ✅ 일반 프로필 등록 스키마
   const clientProfilePostSchema = z.object({
      profileImage: profileImageSchema,
      serviceType: serviceTypeSchema,
      livingArea: livingAreaSchema,
   });

   /**
    * ✅ 일반 프로필 수정 스키마: 함수로 제작
    */
   const updateClientProfileSchema = (provider?: string) =>
      z
         .object({
            name: nameSchema.optional(),
            phone: phoneSchema.optional(),
            password: passwordSchema,
            newPassword: passwordSchema.or(z.literal("")),
            newPasswordConfirmation: passwordSchema.or(z.literal("")),
            profileImage: profileImageSchema,
            serviceType: serviceTypeSchema.optional(),
            livingArea: livingAreaSchema.optional(),
         })
         .superRefine((data, ctx) => {
            const { newPassword, newPasswordConfirmation, password } = data;
            const isPasswordChangeAttempted =
               !!newPassword || !!newPasswordConfirmation;

            // 0. [일반 로그인] 현재 비밀번호 필수
            if (provider === "LOCAL") {
               if (!password || password.length === 0) {
                  ctx.addIssue({
                     path: ["password"],
                     message: t("profilePasswordRequired"),
                     code: z.ZodIssueCode.custom,
                  });
               }

               // 1. [일반 로그인] 새 비밀번호 자릿수 검사
               if (isPasswordChangeAttempted) {
                  if (!newPassword || newPassword.length < 8) {
                     ctx.addIssue({
                        path: ["newPassword"],
                        message: t("passwordMin"),
                        code: z.ZodIssueCode.custom,
                     });
                  }

                  // 2. [일반 로그인] 새 비밀번호를 설정하면 확인도 해야 함
                  if (newPassword !== newPasswordConfirmation) {
                     ctx.addIssue({
                        path: ["newPasswordConfirmation"],
                        message: t("newPasswordMismatch"),
                        code: z.ZodIssueCode.custom,
                     });
                  }
               }
            } else {
               // [소셜 로그인] 비밀번호 변경 시도 자체를 막음
               if (isPasswordChangeAttempted) {
                  ctx.addIssue({
                     path: ["newPassword"],
                     message: t("socialPasswordChangeNotAllowed"),
                     code: z.ZodIssueCode.custom,
                  });
               }
            }
         });

   return {
      clientProfilePostSchema,
      updateClientProfileSchema,
   };
}

// ✅ 타입 반출
export type ClientProfilePostValue = z.infer<
   ReturnType<typeof useClientProfileSchemas>["clientProfilePostSchema"]
>;

export type ClientProfileUpdateValue = z.infer<
   ReturnType<
      ReturnType<typeof useClientProfileSchemas>["updateClientProfileSchema"]
   >
>;
