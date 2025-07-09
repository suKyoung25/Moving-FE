import { z } from "zod";

// 일반 회원 쪽
export const signUpSchema = z
  .object({
    nickname: z
      .string()
      .trim()
      .min(1, "성함을 입력해 주세요.")
      .max(4, "4자 이내로 입력해 주세요."),

    email: z.string().trim().email("이메일 형식이 아닙니다."),

    phoneNumber: z
      .string()
      .trim()
      .regex(
        /^\d{10,11}$/,
        "전화번호는 10~11자리의 숫자로만 입력할 수 있습니다."
      ),

    password: z.string().min(8, "비밀번호를 8자리 이상 입력해 주세요."),

    passwordConfirmation: z
      .string()
      .min(8, "비밀번호를 8자리 이상 입력해 주세요."),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirmation"],
  });

// 일반 회원 쪽
export const loginSchema = z.object({
  email: z.string().trim().email("이메일 형식이 아닙니다."),

  password: z.string().min(8, "비밀번호를 8자리 이상 입력해 주세요."),
});
