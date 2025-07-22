import z from "zod";

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

export type MoverProfileRequestInput = z.infer<
   typeof MoverProfileRequestSchema
>;
export type MoverProfileInput = z.infer<typeof MoverProfileSchema>;

// ✅ 공통 스키마
const baseProfileSchema = z.string().trim();

// ✅ 개별 스키마
export const nameSchema = baseProfileSchema
   .min(1, "성함을 입력해 주세요.")
   .max(4, "4자 이내로 입력해 주세요.");

export const emailSchema =
   baseProfileSchema.email("올바른 이메일 형식이 아닙니다.");

export const phoneSchema = baseProfileSchema
   .min(9, "9자 이상 입력해주세요.")
   .regex(
      /^(\+82\s?1[016789]-?\d{3,4}-?\d{4}|0\d{1,2}-?\d{3,4}-?\d{4})$/,
      "유효한 전화번호를 입력해주세요.",
   );

export const passwordSchema = baseProfileSchema
   .min(8, "비밀번호를 8자리 이상 입력해 주세요.")
   .regex(
      /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/,
      "문자와 숫자를 섞어 사용해 주세요.",
   );

export const newPasswordSchema = baseProfileSchema
   .min(8, "비밀번호를 8자리 이상 입력해 주세요.")
   .regex(
      /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/,
      "문자와 숫자를 섞어 사용해 주세요.",
   );

export const newPasswordConfirmationSchema = baseProfileSchema
   .min(8, "비밀번호를 8자리 이상 입력해 주세요.")
   .regex(
      /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/,
      "문자와 숫자를 섞어 사용해 주세요.",
   );

// ✅ 일반 프로필 수정 페이지 스키마
export const clientProfileSchema = z
   .object({
      name: nameSchema,
      email: emailSchema,
      phone: phoneSchema,
      password: passwordSchema,
      newPassword: newPasswordSchema,
      newPasswordConfirmation: baseProfileSchema,
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
