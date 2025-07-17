"use server";

import { AuthActionResult } from "@/lib/types/auth.types";
import { loginFormSchema } from "@/lib/validations/auth.schemas";
import { defaultFetch } from "../../api/fetch-client";
import isFetchError from "@/lib/utils/fetch-error.util";

export default async function createClientLocalLoginAction(
   _: AuthActionResult | null,
   formData: FormData,
): Promise<AuthActionResult> {
   try {
      // ✅ 자료 구조
      const rawFormData = {
         email: formData.get("email")?.toString() || "",
         password: formData.get("password")?.toString() || "",
      };

      // ✅ 유효성 검사
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

      // ✅ 백엔드 연동
      const response = await defaultFetch("/auth/signin/client", {
         method: "POST",
         body: JSON.stringify(validationResult.data),
      });

      // 성공 응답
      return {
         success: true,
         user: response.data.clientInfo,
         accessToken: response.data.accessToken,
      };
   } catch (error: unknown) {
      console.error("로그인 실패 원인: ", error);

      // 문자열 message, 객체 data 중 message 받음
      if (isFetchError(error)) {
         const { message } = error.body;

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
