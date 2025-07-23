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
   newPassword: z.string().optional(),
   newPasswordConfirmation: z.string().optional(),
};

//refine 로직 때문에 분리 (cheackNewPassword)
export const MoverBasicInfoSchema = z
   .object(rawMoverBasicInfoSchema)
   .superRefine((data, ctx) => {
      const { newPassword, newPasswordConfirmation } = data;

      const eitherPasswordExists = !!newPassword || !!newPasswordConfirmation;

      if (eitherPasswordExists) {
         if (!newPassword || newPassword.length < 8) {
            ctx.addIssue({
               // 에러를 특정 필드에 추가
               path: ["newPassword"],
               message: "새 비밀번호는 최소 8자리 이상이어야 합니다.",
               code: z.ZodIssueCode.custom,
            });
         }

         if (!newPasswordConfirmation || newPasswordConfirmation.length < 8) {
            ctx.addIssue({
               path: ["newPasswordConfirmation"],
               message: "새 비밀번호 확인은 최소 8자리 이상이어야 합니다.",
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
               message: "비밀번호가 일치하지 않습니다.",
               code: z.ZodIssueCode.custom,
            });
         }
      }
   });

export type MoverBasicInfoInput = z.infer<typeof MoverBasicInfoSchema>;
