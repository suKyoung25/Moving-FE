// 도메인 단위

import z from "zod";

//기사님 기본정보 수정 시 사용
const rawMoverBasicInfoSchema = {
   name: z.string().min(2, "본명을 입력해주세요"),
   email: z.string().email("올바른 이메일 형식이 아닙니다."),
   phone: z
      .string()
      .min(10, "최소 10자리 이상이어야 합니다.")
      .regex(/^\d+$/, "숫자만 입력해주세요."),
   existedPassword: z.string().min(8, "기존 비밀번호를 입력해주세요."),
   newPassword: z.string().min(8, "최소 8자리 이상이어야 합니다."),
   newPasswordConfirmation: z.string().min(8, "최소 8자리 이상이어야 합니다."),
};

//refine 로직 때문에 분리 (cheackNewPassword)
export const MoverBasicInfoSchema = z
   .object(rawMoverBasicInfoSchema)
   .refine((data) => data.newPassword === data.newPasswordConfirmation, {
      path: ["newPasswordConfirmation"],
      message: "비밀번호가 일치하지 않습니다.",
   });

export type MoverBasicInfoInput = z.infer<typeof MoverBasicInfoSchema>;
