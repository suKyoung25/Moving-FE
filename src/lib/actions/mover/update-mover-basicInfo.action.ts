"use server";

import { tokenFetch } from "@/lib/api/fetch-client";
import { profileState } from "@/lib/types";
import isFetchError from "@/lib/utils/fetch-error.util";
import {
   MoverBasicInfoInput,
   moverBasicInfoSchema,
} from "@/lib/validations/mover/basicInfo/basicInfo.schemas";

export async function updateMoverBasicInfo(
   state: profileState | null,
   formData: FormData,
): Promise<profileState> {
   try {
      const basicInfoInputData: MoverBasicInfoInput = {
         name: formData.get("name")?.toString() || "",
         email: formData.get("email")?.toString() || "",
         phone: formData.get("phone")?.toString() || "",
         existedPassword: formData.get("existedPassword")?.toString() || "",
         newPassword: formData.get("newPassword")?.toString() || "",
         newPasswordConfirmation:
            formData.get("checkNewPassword")?.toString() || "",
      };

      const validationResult =
         moverBasicInfoSchema.safeParse(basicInfoInputData);

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

      //백엔드 연동
      const response = await tokenFetch("/dashboard/edit/mover", {
         method: "PATCH",
         body: JSON.stringify(validationResult.data),
      });

      return { success: true, user: response };
   } catch (error) {
      console.error("기본정보 수정 실패 원인: ", error);

      // 문자열 message, 객체 data 중 message 받음
      if (isFetchError(error)) {
         const message = error.body.message;
         const fieldErrors = error.body.data;

         if (message.includes("DB와 대조 시")) {
            return {
               success: false,
               fieldErrors: fieldErrors as Record<string, string>,
            };
         }
      }

      return {
         success: false,
         globalError:
            "기본정보 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      };
   }
}
