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
  checkNewPassword: z.string().min(8, "최소 8자리 이상이어야 합니다."),
};

//refine 로직 때문에 분리 (cheackNewPassword)
export const moverBasicInfoSchema = z
  .object(rawMoverBasicInfoSchema)
  .refine((data) => data.newPassword === data.checkNewPassword, {
    path: ["checkNewPassword"],
    message: "비밀번호가 일치하지 않습니다.",
  });

//schema 재사용을 위한 export
export const basicInfoSchema = {
  realName: rawMoverBasicInfoSchema.name,
  email: rawMoverBasicInfoSchema.email,
  phone: rawMoverBasicInfoSchema.phone,
  existedPassword: rawMoverBasicInfoSchema.existedPassword,
  newPassword: rawMoverBasicInfoSchema.newPassword,
  checkNewPassword: rawMoverBasicInfoSchema.checkNewPassword,
};

export type MoverBasicInfoInput = z.infer<typeof moverBasicInfoSchema>;
