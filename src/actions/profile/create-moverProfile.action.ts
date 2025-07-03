"use server";

import { moverProfileSchema } from "@/validations";

type profileState = {
  status: boolean;
  error?: string;
} | null;

export async function createMoverProfile(
  state: profileState,
  formData: FormData
): Promise<profileState> {
  try {
    const profileInputData = {
      image: formData.get("image") as string,
      name: formData.get("name") as string,
      career: Number(formData.get("career")),
      onelineIntroduction: formData.get("onelineIntroduction") as string,
      detailDescription: formData.get("detailDescription") as string,
      serviceType: formData.getAll("serviceType") as string[],
      area: formData.getAll("area") as string[],
    };

    //데이터 유효성 검사
    const parsed = moverProfileSchema.safeParse(profileInputData);

    if (!parsed.success) {
      const formatted = parsed.error.format();

      return { status: false, error: JSON.stringify(formatted) };
    }

    //디버깅
    const profile = parsed.data;
    console.log("서버로 전송할 데이터", profile);

    return { status: true };
  } catch (error) {
    console.error("서버 에러:", error);
    return { status: false };
  }
}
