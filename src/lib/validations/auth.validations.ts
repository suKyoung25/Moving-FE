import * as authSchema from "./auth.schemas";

// ✅ 이름 검사
export function nameValidate(name: string) {
  return authSchema.nameSchema.safeParse(name);
}

// ✅ 이메일 검사
export function emailValidate(email: string) {
  return authSchema.emailSchema.safeParse(email);
}

// ✅ 전화번호 검사
export function phoneNumberValidate(phoneNumber: string) {
  return authSchema.phoneNumberSchema.safeParse(phoneNumber);
}

// ✅ 비밀번호 검사
export function passwordValidate(password: string) {
  return authSchema.passwordSchema.safeParse(password);
}

// ✅ 비밀번호 확인 검사
export function passwordConfirmationValidate(
  password: string,
  passwordConfirmation: string
) {
  if (password !== passwordConfirmation) {
    return {
      success: false,
      message: "비밀번호가 일치하지 않습니다.",
    };
  }
  return { success: true };
}

// ✅ 전체 검증 - 회원가입
export function signUpFormValidate(data: {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
}) {
  return authSchema.signUpFormSchema.safeParse(data);
}

// ✅ 전체 검증 - 로그인
export function loginFormValidate(data: { email: string; password: string }) {
  return authSchema.loginFormSchema.safeParse(data);
}
