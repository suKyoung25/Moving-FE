import z from "zod";
import {
   emailSchema,
   nameSchema,
   passwordSchema,
   phoneSchema,
} from "./auth.schema";

// ✅ 개별 스키마
export const profileImageSchema = z.string().url().optional();

export const serviceTypeSchema = z
   .array(z.enum(["SMALL", "HOME", "OFFICE"]))
   .min(1, "서비스 유형을 1개 이상 선택해야 합니다.");

export const livingAreaSchema = z
   .array(z.string())
   .min(1, "지역을 1개 이상 선택해야 합니다.")
   .max(3, "지역은 3개까지 선택할 수 있습니다.");

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
      password: passwordSchema,
      newPassword: passwordSchema.optional(),
      newPasswordConfirmation: z.string().optional().or(z.literal("")),
      profileImage: profileImageSchema,
      serviceType: serviceTypeSchema.optional(),
      livingArea: livingAreaSchema.optional(),
   })
   .refine((data) => data.password !== data.newPassword, {
      message: "현재 비밀번호와 새 비밀번호를 다르게 설정해 주세요.",
      path: ["newPassword"],
   })
   .refine((data) => data.newPassword === data.newPasswordConfirmation, {
      message: "새로운 비밀번호가 일치하지 않습니다.",
      path: ["newPasswordConfirmation"],
   });

// ✅ 타입 반출
export type ClientProfilePostValue = z.infer<typeof ClientProfilePostSchema>;
export type ClientProfileUpdateValue = z.infer<
   typeof clientProfileUpdateSchema
>;
