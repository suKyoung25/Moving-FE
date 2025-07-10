import * as authSchema from "./auth.schemas";
import { ZodType, ZodTypeDef } from "zod";
import { AuthValidationResult } from "../types/auth.type";

// ✅ 타입 오류 없애는 용도의 공용 함수
function validateField<TInput, TOutput>(
   schema: ZodType<TOutput, ZodTypeDef, TInput>,
   value: TInput,
): AuthValidationResult {
   const result = schema.safeParse(value);
   return result.success
      ? { success: true, message: "" }
      : { success: false, message: result.error.issues[0].message };
}

// ✅ 이름 검사
export function validateAuthName(name: string) {
   return validateField(authSchema.nameSchema, name);
}

// ✅ 이메일 검사
export function validateAuthEmail(email: string) {
   return validateField(authSchema.emailSchema, email);
}

// ✅ 전화번호 검사
export function validateAuthPhoneNumber(phoneNumber: string) {
   return validateField(authSchema.phoneNumberSchema, phoneNumber);
}

// ✅ 비밀번호 검사
export function validateAuthPassword(password: string) {
   return validateField(authSchema.passwordSchema, password);
}

// ✅ 비밀번호 재확인 검사
export function validateAuthCheckPassword(
   password: string,
   checkedPassword: string,
) {
   if (password !== checkedPassword) {
      return {
         success: false,
         message: "비밀번호와 일치하지 않습니다.",
      };
   }
   return validateField(authSchema.checkPasswordSchema, checkedPassword);
}

// ✅ 전체 검증 - 회원가입
export function validateSignUpForm(data: {
   name: string;
   email: string;
   phoneNumber: string;
   password: string;
   passwordConfirmation: string;
}) {
   return authSchema.signUpFormSchema.safeParse(data);
}

// ✅ 전체 검증 - 로그인
export function validateLoginForm(data: { email: string; password: string }) {
   return authSchema.loginFormSchema.safeParse(data);
}
