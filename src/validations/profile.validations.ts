import { ValidationResult } from "@/types/profile.types";
import { z } from "zod";

export function validateName(name: string | string[]): ValidationResult {
  const schema = z.string().min(1, "별명을 입력해주세요.");
  const result = schema.safeParse(name);
  return result.success
    ? { success: true, message: "유효한 이름입니다." }
    : { success: false, message: result.error.issues[0].message };
}

export function validateCareer(career: string | string[]): ValidationResult {
  const schema = z
    .string()
    .min(1, "숫자만 입력해주세요.")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "경력은 0 이상이어야 합니다.",
    });

  const result = schema.safeParse(career);
  return result.success
    ? { success: true, message: "유효한 경력입니다." }
    : { success: false, message: result.error.issues[0].message };
}

export function validateOnelineIntroduction(
  text: string | string[]
): ValidationResult {
  const schema = z.string().min(8, "8자 이상 입력해주세요.");
  const result = schema.safeParse(text);
  return result.success
    ? { success: true, message: "유효한 한 줄 소개입니다." }
    : { success: false, message: result.error.issues[0].message };
}

export function validateDetailDescription(
  text: string | string[]
): ValidationResult {
  const schema = z.string().min(10, "10자 이상 입력해주세요.");
  const result = schema.safeParse(text);
  return result.success
    ? { success: true, message: "유효한 상세 소개입니다." }
    : { success: false, message: result.error.issues[0].message };
}

export function validateServiceType(
  serviceType: string | string[]
): ValidationResult {
  const schema = z.array(z.string().min(1)).min(1, "* 1개 이상 선택해주세요.");
  const result = schema.safeParse(serviceType);
  return result.success
    ? { success: true, message: "유효한 서비스 타입입니다." }
    : { success: false, message: result.error.issues[0].message };
}

export function validateArea(area: string | string[]): ValidationResult {
  const schema = z.array(z.string().min(1)).min(1, "* 1개 이상 선택해주세요.");
  const result = schema.safeParse(area);
  return result.success
    ? { success: true, message: "유효한 지역입니다." }
    : { success: false, message: result.error.issues[0].message };
}
