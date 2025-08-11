import { useTranslations } from "next-intl";
import { z } from "zod";

export function useAuthSchemas() {
   const t = useTranslations("Validations");
   // ✅ 공통 스키마
   const baseAuthSchema = z.string().trim();

   // ✅ 개별 스키마
   const emailSchema = baseAuthSchema.email(t("invalidEmail"));

   const passwordSchema = baseAuthSchema
      .min(8, t("passwordMin"))
      .regex(
         /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/,
         t("passwordPattern"),
      );

   const checkPasswordSchema = baseAuthSchema
      .min(8, t("passwordMin"))
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/, t("passwordNumberMix"));

   const nameSchema = baseAuthSchema
      .min(2, t("nameMin"))
      .max(4, t("nameMax"))
      .trim();

   const phoneSchema = baseAuthSchema
      .min(9, t("phoneMin"))
      .max(11, t("phoneMax"))
      .regex(/^\d{9,11}$/, t("phoneInvalid"));

   // ✅ 회원가입 스키마 (비밀번호 확인 포함)
   const signUpFormSchema = z
      .object({
         name: nameSchema,
         email: emailSchema,
         phone: phoneSchema,
         password: passwordSchema,
         passwordConfirmation: baseAuthSchema,
      })
      .refine((data) => data.password === data.passwordConfirmation, {
         message: t("passwordMismatch"),
         path: ["passwordConfirmation"],
      });

   // ✅ 로그인 스키마
   const signInFormSchema = z.object({
      email: emailSchema,
      password: passwordSchema,
   });

   // 회원탈퇴 스키마
   const withdrawFormSchema = z
      .object({
         userId: z.string().optional(),
         password: passwordSchema.optional(),
         confirmMessage: z.string().optional(),
      })
      .superRefine((data, ctx) => {
         const isLocal = "password" in data;

         if (isLocal) {
            // 로컬 유저인 경우: password가 필수
            if (!data.password || data.password.trim() === "") {
               ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ["password"],
                  message: t("passwordRequired"),
               });
            }
         } else {
            // 소셜 유저인 경우: confirmMessage가 "회원 탈퇴" 필수
            if (data.confirmMessage?.trim() !== "회원 탈퇴") {
               ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ["confirmMessage"],
                  message: t("confirmMessageExact"),
               });
            }
         }
      });
   return {
      nameSchema,
      phoneSchema,
      signUpFormSchema,
      signInFormSchema,
      withdrawFormSchema,
   };
}

// ✅ 타입 반출
export type SignUpFormValues = z.infer<
   ReturnType<typeof useAuthSchemas>["signUpFormSchema"]
>;
export type SignInFormValues = z.infer<
   ReturnType<typeof useAuthSchemas>["signInFormSchema"]
>;
export type WithdrawFormValues = z.infer<
   ReturnType<typeof useAuthSchemas>["withdrawFormSchema"]
>;
