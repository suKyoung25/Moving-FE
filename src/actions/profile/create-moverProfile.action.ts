"use server";

import { profileState } from "@/types/profile.types";
import { moverProfileSchema } from "@/validations";

export async function createMoverProfile(
  state: profileState,
  formData: FormData
): Promise<profileState> {
  try {
    const profileInputData = {
      image: formData.get("image") as string,
      name: formData.get("name") as string,
      career: formData.get("career") as string,
      onelineIntroduction: formData.get("onelineIntroduction") as string,
      detailDescription: formData.get("detailDescription") as string,
      serviceType: formData.getAll("serviceType") as string[],
      area: formData.getAll("area") as string[],
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
