"use server";

import { defaultFetch } from "@/lib/api/fetch-client";
import { AuthActionResult, AuthValidation } from "@/lib/types/auth.type";
import isFetchError from "@/lib/utils/fetch-error.util";
import { loginFormSchema } from "@/lib/validations/auth.schemas";

export default async function createMoverLocalLoginAction(
   _: AuthValidation | null,
   formData: FormData,
): Promise<AuthActionResult> {
   try {
      const rawFormData = {
         email: formData.get("email")?.toString(),
         password: formData.get("password")?.toString(),
      };

      // 유효성 검사
      const validationResult = loginFormSchema.safeParse(rawFormData);

      if (!validationResult.success) {
         const errors = validationResult.error.flatten().fieldErrors;
         return {
            success: false,
            fieldErrors: Object.fromEntries(
               Object.entries(errors).map(([key, value]) => [
                  key,
                  Array.isArray(value) ? value[0] : value,
               ]),
            ),
         };
      }

      // 백엔드 연동
      const response = await defaultFetch("/auth/signin/mover", {
         method: "POST",
         body: JSON.stringify(validationResult.data),
      });

      // 성공 응답
      return {
         success: true,
         user: response.data.user,
         accessToken: response.data.accessToken,
      };
   } catch (error) {
      console.error("로그인 실패 원인: ", error);

      // 문자열 message, 객체 data 중 message 받음
      if (isFetchError(error)) {
         const message = error.body.message;

         if (message.includes("사용자")) {
            return { success: false, fieldErrors: { email: message } };
         }

         if (message.includes("비밀번호")) {
            return { success: false, fieldErrors: { password: message } };
         }
      }

      return {
         success: false,
         globalError: "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      };
   }
}
