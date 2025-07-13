"use server";

import { AuthValidation } from "@/lib/types/auth.type";
import { signUpFormSchema } from "@/lib/validations/auth.schemas";
import { defaultFetch } from "../../api/fetch-client";

export default async function createClientLocalSignupAction(
   _: AuthValidation | null,
   formData: FormData,
): Promise<AuthValidation> {
   try {
      // ✅ 자료 구조
      const rawFormData = {
         name: formData.get("name")?.toString(),
         email: formData.get("email")?.toString(),
         phone: formData.get("phone")?.toString(),
         password: formData.get("password")?.toString(),
         passwordConfirmation: formData.get("passwordConfirmation")?.toString(),
      };

      // ✅ 유효성 검사
      const validationResult = signUpFormSchema.safeParse(rawFormData);

      if (!validationResult.success) {
         const errors = validationResult.error.flatten().fieldErrors;
         return { status: false, error: JSON.stringify(errors) };
      }

      // ✅ 백엔드 연동
      await defaultFetch("/auth/signup/client", {
         method: "POST",
         body: JSON.stringify(validationResult.data),
      });

      return { status: true };
   } catch (error: any) {
      console.error("회원가입 실패 원인: ", error);

      // ✅ BE 오류 받음 (이메일, 전화번호 중복)
      if (error?.body?.message) {
         try {
            // message에 JSON 형태 오류가 들어오면 파싱
            const parsed = JSON.parse(
               error.body.message.replace("회원가입 실패: ", ""),
            );

            return { status: false, error: parsed };
         } catch {
            // 파싱 실패 -> 일반 문자열 처리
            return { status: false, error: { error: error.body.message } };
         }
      }

      return { status: false, error: "알 수 없는 오류가 발생했습니다." };
   }
}
