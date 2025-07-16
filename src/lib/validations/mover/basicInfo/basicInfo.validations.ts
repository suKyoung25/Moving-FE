import { ZodType } from "zod";
import { ValidationResult } from "@/lib/types/profile.types";
import { basicInfoSchema } from "./basicInfo.schemas";

function validateField(
   schema: ZodType,
   value: string,
   successMsg: string,
): ValidationResult {
   const result = schema.safeParse(value);
   return result.success
      ? { success: true, message: successMsg }
      : { success: false, message: result.error.issues[0].message };
}

export const validateName = (name: string) =>
   validateField(basicInfoSchema.name, name, "유효한 이름입니다.");

export const validateEmail = (email: string) =>
   validateField(basicInfoSchema.email, email, "유효한 이메일입니다.");

export const validatePhone = (phone: string) =>
   validateField(basicInfoSchema.phone, phone, "유효한 전화번호입니다.");

export const validateExistedPassword = (existedPassword: string) =>
   validateField(
      basicInfoSchema.existedPassword,
      existedPassword,
      "유효한 비밀번호입니다.",
   );

export const validateNewPassword = (newPassword: string) =>
   validateField(
      basicInfoSchema.newPassword,
      newPassword,
      "유효한 새 비밀번호입니다.",
   );

export const validateCheckNewPassword = (
   checkNewPassword: string,
   newPassword: string,
) => {
   if (checkNewPassword !== newPassword) {
      return {
         success: false,
         message: "새 비밀번호와 일치하지 않습니다.",
      };
   }

   return validateField(
      basicInfoSchema.newPasswordConfirmation,
      checkNewPassword,
      "유효한 새 비밀번호입니다.",
   );
};
