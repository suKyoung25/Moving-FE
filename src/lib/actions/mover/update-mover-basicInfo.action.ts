"use server";

import { tokenFetch } from "@/lib/api/fetch-client";
import { profileState } from "@/lib/types";
import {
   MoverBasicInfoInput,
   moverBasicInfoSchema,
} from "@/lib/validations/mover/basicInfo/basicInfo.schemas";
import { revalidatePath } from "next/cache";

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

      //디버깅
      console.log("ㅁㄴㅇㄻ!!서버액션 끝");

      // 리다이렉트 & 컴포넌트 재실행
      // revalidatePath("/dashboard"); // 페이지 최신화
      // redirect("/dashboard"); // 이동

      return { success: true, user: response };
   } catch (error) {
      console.error("서버 에러:", error);
      return { success: false };
   }
}
