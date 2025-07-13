"use server";

import { AuthValidation } from "@/lib/types/auth.type";
import { loginFormSchema } from "@/lib/validations/auth.schemas";
import { defaultFetch } from "../../api/fetch-client";

export default async function createClientLocalLoginAction(
   _: AuthValidation | null,
   formData: FormData,
): Promise<AuthValidation> {
   try {
      // ✅ 자료 구조
      const rawFormData = {
         email: formData.get("email")?.toString(),
         password: formData.get("password")?.toString(),
      };

      // ✅ 유효성 검사
      const validationResult = loginFormSchema.safeParse(rawFormData);

      if (!validationResult.success) {
         const errors = validationResult.error.flatten().fieldErrors;
         return { status: false, error: JSON.stringify(errors) };
      }

      // ✅ 백엔드 연동
      await defaultFetch("/auth/signin/client", {
         method: "POST",
         body: JSON.stringify(validationResult.data),
      });

      return { status: true };
   } catch (error: any) {
      console.error("로그인 실패 원인: ", error);

      if (error?.body?.message) {
         const message = error.body.message;

         if (message.includes("사용자를 찾을 수 없습니다")) {
            return { status: false, error: { email: message } };
         }

         if (message.includes("비밀번호를 잘못 입력하셨습니다.")) {
            return { status: false, error: { password: message } };
         }

         return { status: false, error: { global: message } };
      }

      return { status: false, error: { global: "로그인에 실패했습니다." } };
   }
}
