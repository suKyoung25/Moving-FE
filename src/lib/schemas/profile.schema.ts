import z from "zod";
import { emailSchema, passwordSchema, phoneSchema } from "./auth.schema";

//기사님 프로필 관련 사용 (career가 string)
export const MoverProfileSchema = z.object({
   image: z.string().optional(),
   nickName: z.string().min(1, "별명을 입력해주세요."),
   career: z
      .string()
      .min(1, "숫자만 입력해주세요.") // 빈 문자열인지 체크 (처음부터 숫자로 하면 빈문자열을 0으로 인식함)
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
         message: "경력은 0 이상이어야 합니다.",
      }),
   introduction: z.string().min(8, "8자 이상 입력해주세요."),
   description: z.string().min(10, "10자 이상 입력해주세요."),
   serviceType: z.array(z.string().min(1)).min(1, "* 1개 이상 선택해주세요."),
   serviceArea: z.array(z.string().min(1)).min(1, "* 1개 이상 선택해주세요."),
});

// 기사님 프로필 관련 API 전송용 타입 (career가 number)
export const MoverProfileRequestSchema = z.object({
   image: z.string().optional(),
   nickName: z.string(),
   career: z.number().min(0, "경력은 0 이상이어야 합니다."),
   introduction: z.string(),
   description: z.string(),
   serviceType: z.array(z.string()),
   serviceArea: z.array(z.string()),
});

// ✅ 개별 스키마
export const profileImageSchema = z.string().url().optional();

export const serviceTypeSchema = z
   .array(z.enum(["SMALL", "HOME", "OFFICE"]))
   .min(1, "서비스 유형을 1개 이상 선택해야 합니다.");

export const livingAreaSchema = z
   .array(z.string())
   .min(1, "지역을 1개 이상 선택해야 합니다.")
   .max(3, "지역은 3개까지 선택할 수 있습니다.");

//  프로필 수정 스키마
const baseProfileSchema = z.string().trim();

export const nameSchema = baseProfileSchema
   .min(2, "성함을 입력해 주세요.")
   .max(4, "4자 이내로 입력해 주세요.");

// ✅ 일반 프로필 수정 페이지 스키마
export const clientProfileSchema = z
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
export type ClientProfileValue = z.infer<typeof clientProfileSchema>;
export type MoverProfileRequestInput = z.infer<
   typeof MoverProfileRequestSchema
>;
export type MoverProfileInput = z.infer<typeof MoverProfileSchema>;
