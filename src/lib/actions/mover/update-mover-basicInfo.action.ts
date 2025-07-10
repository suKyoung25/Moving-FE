"use server";

import { profileState } from "@/lib/types";
import {
  MoverBasicInfoInput,
  moverBasicInfoSchema,
} from "@/lib/validations/mover/basicInfo/basicInfo.schemas";

export async function updateMoverBasicInfo(
  state: profileState,
  formData: FormData
): Promise<profileState> {
  try {
    const basicInfoInputData: MoverBasicInfoInput = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      existedPassword: formData.get("existedPassword")?.toString() || "",
      newPassword: formData.get("newPassword")?.toString() || "",
      checkNewPassword: formData.get("checkNewPassword")?.toString() || "",
    };

    const parsed = moverBasicInfoSchema.safeParse(basicInfoInputData);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return { status: false, error: JSON.stringify(errors) };
    }

    //todo: fetch 구문 작성 예정

    return { status: true };
  } catch (error) {
    console.error("서버 에러:", error);
    return { status: false };
  }
}
