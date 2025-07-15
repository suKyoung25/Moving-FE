"use server";

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

      // fetch 직접 요청
      const BASE_URL = "http://localhost:4000";
      const response = await fetch(`${BASE_URL}/auth/signin/mover`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(validationResult.data),
         credentials: "include",
         cache: "no-store",
      });

      if (!response.ok) {
         throw { status: response.status };
      }

      const result = await response.json();
      console.log("서버액션 결과", result);

      // // accessToken 쿠키에 저장 (서버 측 쿠키)
      // cookies().set("accessToken", accessToken, {
      //    httpOnly: true,
      //    secure: process.env.NODE_ENV === "production",
      //    path: "/",
      //    maxAge: 60 * 60 * 1, // 1시간
      // });

      // 성공 응답
      return {
         success: true,
         user: result.user,
         accessToken: result.accessToken,
      };
   } catch (error) {
      console.error("로그인 실패 원인: ", error);

      if (isFetchError(error)) {
         const message = error.body.message;

         if (message.includes("사용자를 찾을 수 없습니다")) {
            return { success: false, fieldErrors: { email: message } };
         }

         if (message.includes("비밀번호를 잘못 입력하셨습니다.")) {
            return { success: false, fieldErrors: { password: message } };
         }
      }

      return {
         success: false,
         globalError: "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      };
   }
}
