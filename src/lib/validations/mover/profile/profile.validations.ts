import { ZodType, ZodTypeDef } from "zod";
import { ValidationResult } from "@/lib/types/profile.types";
import { profileSchemas } from "./profile.schemas";

function validateField<TInput, TOutput>(
   schema: ZodType<TOutput, ZodTypeDef, TInput>,
   value: TInput,
   successMsg: string,
): ValidationResult {
   const result = schema.safeParse(value);
   return result.success
      ? { success: true, message: successMsg }
      : { success: false, message: result.error.issues[0].message };
}

export const validateProfileName = (name: string | string[]) =>
   validateField(profileSchemas.nickName, name, "유효한 이름입니다.");

export const validateCareer = (career: string | string[]) =>
   validateField(profileSchemas.career, career, "유효한 경력입니다.");

export const validateOnelineIntroduction = (text: string | string[]) =>
   validateField(
      profileSchemas.onelineIntroduction,
      text,
      "유효한 한 줄 소개입니다.",
   );

export const validateDetailDescription = (text: string | string[]) =>
   validateField(
      profileSchemas.detailDescription,
      text,
      "유효한 상세 소개입니다.",
   );

export const validateServiceType = (type: string | string[]) =>
   validateField(profileSchemas.serviceType, type, "유효한 서비스 타입입니다.");

export const validateArea = (area: string | string[]) =>
   validateField(profileSchemas.area, area, "유효한 지역입니다.");
