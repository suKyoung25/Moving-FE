"use server";

import {
  validateName,
  validateCareer,
  validateOnelineIntroduction,
  validateDetailDescription,
  validateServiceType,
  validateArea,
} from "@/validations";

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
      career: formData.get("career") as string,
      onelineIntroduction: formData.get("onelineIntroduction") as string,
      detailDescription: formData.get("detailDescription") as string,
      serviceType: formData.getAll("serviceType") as string[],
      area: formData.getAll("area") as string[],
    };

    // 개별 유효성 검사 실행
    const errors: Record<string, string> = {};

    const nameResult = validateName(profileInputData.name);
    if (!nameResult.success) errors.name = nameResult.message;

    const careerResult = validateCareer(profileInputData.career);
    if (!careerResult.success) errors.career = careerResult.message;

    const onelineResult = validateOnelineIntroduction(
      profileInputData.onelineIntroduction
    );
    if (!onelineResult.success)
      errors.onelineIntroduction = onelineResult.message;

    const detailResult = validateDetailDescription(
      profileInputData.detailDescription
    );
    if (!detailResult.success) errors.detailDescription = detailResult.message;

    const serviceTypeResult = validateServiceType(profileInputData.serviceType);
    if (!serviceTypeResult.success)
      errors.serviceType = serviceTypeResult.message;

    const areaResult = validateArea(profileInputData.area);
    if (!areaResult.success) errors.area = areaResult.message;

    if (Object.keys(errors).length > 0) {
      return { status: false, error: JSON.stringify(errors) };
    }

    return { status: true };
  } catch (error) {
    console.error("서버 에러:", error);
    return { status: false };
  }
}
