"use server";

import { profileState } from "@/lib/types";
import {
  MoverProfileInput,
  moverProfileSchema,
} from "@/lib/validations/mover/profile/profile.schemas";

export async function createMoverProfile(
   state: profileState,
   formData: FormData,
): Promise<profileState> {
   try {
      const profileInputData: MoverProfileInput = {
         image: formData.get("image")?.toString(),
         nickName: formData.get("name")?.toString() ?? "",
         career: formData.get("career")?.toString() ?? "",
         onelineIntroduction:
            formData.get("onelineIntroduction")?.toString() ?? "",
         detailDescription: formData.get("detailDescription")?.toString() ?? "",
         serviceType: formData
            .getAll("serviceType")
            ?.map((item) => item.toString()),
         area: formData.getAll("area")?.map((item) => item.toString()),
      };

      const parsed = moverProfileSchema.safeParse(profileInputData);

      if (!parsed.success) {
         const errors = parsed.error.flatten().fieldErrors;
         return { status: false, error: JSON.stringify(errors) };
      }

      // TODO: fetch 구문 작성 예정

      return { status: true };
   } catch (error) {
      console.error("서버 에러:", error);
      return { status: false };
   }
}
