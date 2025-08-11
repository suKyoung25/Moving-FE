// 도메인 단위

import { useTranslations } from "next-intl";
import z from "zod";
import { RefinementCtx } from "zod";

//스키마 분기처리를 위해
type ExtendedRefinementCtx = RefinementCtx & {
   context?: {
      isLocal?: boolean;
   };
};

const allowedDomains = ["gmail.com", "naver.com", "daum.net"];

export function useMoverBasicInfoSchema() {
   const t = useTranslations("Validations");

   //기사님 기본정보 수정 시 사용
   const rawMoverBasicInfoSchema = {
      name: z.string().min(2, t("nameMin")).max(4, t("nameMax")),
      email: z
         .string()
         .email(t("invalidEmail"))
         .refine(
            (email) => {
               const domain = email.split("@")[1];
               return allowedDomains.includes(domain);
            },
            {
               message: t("allowedEmailDomains"),
            },
         ),
      phone: z
         .string()
         .min(9, t("phoneMin"))
         .max(11, t("phoneMax"))
         .regex(/^\d+$/, t("onlyNumbers")),
      newPassword: z
         .string()
         .min(8, t("passwordMin"))
         .max(16, t("passwordMax"))
         .regex(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,16}$/,
            t("passwordPattern"),
         )
         .optional()
         .or(z.literal("")),
      newPasswordConfirmation: z.string().optional(),
   };

   //refine 로직 때문에 분리 (cheackNewPassword)
   const moverBasicInfoSchema = z
      .object({
         ...rawMoverBasicInfoSchema,
         existedPassword: z.string().optional(),
      })
      .superRefine((data, ctx) => {
         const { context } = ctx as ExtendedRefinementCtx;
         const isLocal = context?.isLocal;

         if (
            isLocal &&
            (!data.existedPassword || data.existedPassword.length < 8)
         ) {
            ctx.addIssue({
               path: ["existedPassword"],
               message: t("profilePasswordRequired"),
               code: z.ZodIssueCode.custom,
            });
         }

         const { newPassword, newPasswordConfirmation } = data;

         const eitherPasswordExists =
            !!newPassword || !!newPasswordConfirmation;

         if (eitherPasswordExists) {
            if (!newPassword || newPassword.length < 8) {
               ctx.addIssue({
                  // 에러를 특정 필드에 추가
                  path: ["newPassword"],
                  message: t("passwordMin"),
                  code: z.ZodIssueCode.custom,
               });
            }

            if (
               !newPasswordConfirmation ||
               newPasswordConfirmation.length < 8
            ) {
               ctx.addIssue({
                  path: ["newPasswordConfirmation"],
                  message: t("passwordMin"),
                  code: z.ZodIssueCode.custom,
               });
            }

            if (
               newPassword &&
               newPasswordConfirmation &&
               newPassword !== newPasswordConfirmation
            ) {
               ctx.addIssue({
                  path: ["newPasswordConfirmation"],
                  message: t("newPasswordMismatch"),
                  code: z.ZodIssueCode.custom,
               });
            }
         }
      });
   return { moverBasicInfoSchema };
}

export type MoverBasicInfoInput = z.infer<
   ReturnType<typeof useMoverBasicInfoSchema>["moverBasicInfoSchema"]
>;
