"use server";

import { AuthActionResult, AuthValidation } from "@/lib/types/auth.type";
import isFetchError from "@/lib/utils/fetch-error.util";
import { signUpFormSchema } from "@/lib/validations/auth.schemas";

export default async function createMoverLocalSignupAction(
   _: AuthValidation | null,
   formData: FormData,
): Promise<AuthActionResult> {
   try {
      const rawFormData = {
         name: formData.get("name")?.toString() ?? "",
         email: formData.get("email")?.toString() ?? "",
         phone: formData.get("phoneNumber")?.toString() ?? "",
         password: formData.get("password")?.toString() ?? "",
         passwordConfirmation:
            formData.get("passwordConfirmation")?.toString() ?? "",
      };

      // 유효성 검사
      const validationResult = signUpFormSchema.safeParse(rawFormData);

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

      // //토큰 + 쿠키 관련
      // await tokenFetch(`/auth/signup/mover`, {
      //    method: "POST",
      //    body: JSON.stringify(validationResult.data),
      // });

      return { success: true };
   } catch (error) {
      console.error("회원가입 실패 원인: ", error);

      // ✅ BE 오류 받음 (이메일, 전화번호 중복)
      if (isFetchError(error)) {
         const message = error.body.message;

         // message에 JSON 형태 오류가 들어오면 Parsing
         const parsedErrors = JSON.parse(
            message.replace("회원가입 실패: ", ""),
         );

         if (typeof parsedErrors === "object" && parsedErrors !== null) {
            return {
               success: false,
               fieldErrors: parsedErrors,
            };
         }
      }

      return {
         success: false,
         globalError: "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      };
   }
}
