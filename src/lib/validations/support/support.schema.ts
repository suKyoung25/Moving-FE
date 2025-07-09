import { z } from 'zod'

const supportBaseSchema = z.string().trim();

export const supportNameSchema = supportBaseSchema
    .min(2, "2글자 이상 입력해주세요.")
    .max(8, "8글자 이하로 입력해주세요.")

export const supportEmailSchema = supportBaseSchema
    .email("올바른 이메일 형식이 아닙니다.")
    .min(8, "8자 이상 입력해주세요.")
    .max(50, "50자 이하로 입력해주세요.");

export const supportTitleSchema = supportBaseSchema
    .min(2, "2글자 이상 입력해주세요.")
    .max(50, "50자 이하로 입력해주세요.")
    .regex(/^(?!.*<.*?>).*$/, "HTML 태그를 포함할 수 없습니다.")


export const supportPhoneSchema = supportBaseSchema
    .min(9, "9자 이상 입력해주세요.")  // 최소 9자리: 02-123-4567 같은 케이스
    .max(20, "20자 이하로 입력해주세요.")  // 국제번호까지 감안
    .regex(
        /^(\+82\s?1[016789]-?\d{3,4}-?\d{4}|0\d{1,2}-?\d{3,4}-?\d{4})$/,
        "유효한 전화번호를 입력해주세요."
    );

export const supportContentSchema = supportBaseSchema
    .min(10, "10자 이상 입력해주세요.")
    .max(2000, "2000자 이하로 입력해주세요.")
    .regex(/^(?!.*<.*?>).*$/, "HTML 태그를 포함할 수 없습니다.");


export const supportFilesSchema = z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, {
        message: "파일은 10MB 이하로 업로드해주세요.",
    });