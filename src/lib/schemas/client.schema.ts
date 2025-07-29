import z from "zod";
import { emailSchema, nameSchema, phoneSchema } from "./auth.schema";

// ✅ 개별 스키마
export const profileImageSchema = z
   .union([z.string(), z.instanceof(File)])
   .optional();

export const serviceTypeSchema = z
   .array(z.enum(["SMALL", "HOME", "OFFICE"]))
   .min(1, "* 서비스 유형을 1개 이상 선택해야 합니다.");

export const livingAreaSchema = z
   .array(z.string())
   .min(1, "* 지역을 1개 이상 선택해야 합니다.")
   .max(5, "* 지역은 최대 5개까지 선택할 수 있습니다.");

const passwordSchema = z.string().optional();
const basicPasswordSchema = z
   .string()
   .min(8, "기존 비밀번호를 입력해주세요.")
   .optional();

// ✅ 일반 프로필 등록 페이지 스키마
export const ClientProfilePostSchema = z.object({
   profileImage: profileImageSchema,
   serviceType: serviceTypeSchema,
   livingArea: livingAreaSchema,
});

// ✅ 일반 프로필 수정 페이지 스키마
export const clientProfileUpdateSchema = z
   .object({
      name: nameSchema.optional(),
      email: emailSchema.optional(),
      phone: phoneSchema.optional(),
      password: basicPasswordSchema,
      newPassword: passwordSchema,
      newPasswordConfirmation: passwordSchema,
      profileImage: profileImageSchema,
      serviceType: serviceTypeSchema.optional(),
      livingArea: livingAreaSchema.optional(),
   })
   .superRefine((data, ctx) => {
      const { newPassword, newPasswordConfirmation } = data;

      // 1. 새 비밀번호를 설정하면 확인도 해야 함
      const eitherPasswordExists = !!newPassword || !!newPasswordConfirmation;

      if (eitherPasswordExists) {
         if (!newPassword || newPassword.length < 8) {
            ctx.addIssue({
               path: ["newPassword"],
               message: "새 비밀번호는 최소 8자리 이상이어야 합니다.",
               code: z.ZodIssueCode.custom,
            });
         }

         // 2. 자릿수 설정
         if (!newPasswordConfirmation || newPasswordConfirmation.length < 8) {
            ctx.addIssue({
               path: ["newPasswordConfirmation"],
               message: "새 비밀번호 확인은 최소 8자리 이상이어야 합니다.",
               code: z.ZodIssueCode.custom,
            });
         }

         // 3. 비밀번호 일치 여부
         if (
            newPassword &&
            newPasswordConfirmation &&
            newPassword !== newPasswordConfirmation
         ) {
            ctx.addIssue({
               path: ["newPasswordConfirmation"],
               message: "비밀번호가 일치하지 않습니다.",
               code: z.ZodIssueCode.custom,
            });
         }
      }
   });

// ✅ 타입 반출
export type ClientProfilePostValue = z.infer<typeof ClientProfilePostSchema>;
export type ClientProfileUpdateValue = z.infer<
   typeof clientProfileUpdateSchema
>;
