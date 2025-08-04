import { z } from "zod";

const base = z.string().trim();

export const supportNameSchema = base
   .min(2, "2글자 이상 입력해주세요.")
   .max(8, "8글자 이하로 입력해주세요.");

export const supportEmailSchema = base
   .email("올바른 이메일 형식이 아닙니다.")
   .min(8, "8자 이상 입력해주세요.")
   .max(50, "50자 이하로 입력해주세요.");

export const supportTitleSchema = base
   .min(2, "2글자 이상 입력해주세요.")
   .max(50, "50자 이하로 입력해주세요.")
   .regex(/^(?!.*<.*?>).*$/, "HTML 태그를 포함할 수 없습니다.");

export const supportPhoneSchema = base
   .min(9, "9자 이상 입력해주세요.")
   .max(20, "20자 이하로 입력해주세요.")
   .regex(
      /^(\+82\s?1[016789]-?\d{3,4}-?\d{4}|0\d{1,2}-?\d{3,4}-?\d{4})$/,
      "유효한 전화번호를 입력해주세요.",
   );

export const supportContentSchema = base
   .min(10, "10자 이상 입력해주세요.")
   .max(2000, "2000자 이하로 입력해주세요.")
   .regex(/^(?!.*<.*?>).*$/, "HTML 태그를 포함할 수 없습니다.");

export const supportFilesSchema = z
   .instanceof(File)
   .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "파일은 10MB 이하로 업로드해주세요.",
   });

// ✅ 통합 폼 스키마
export const supportFormSchema = z.object({
   name: supportNameSchema,
   email: supportEmailSchema,
   title: supportTitleSchema,
   number: supportPhoneSchema.optional().or(z.literal("")),
   content: supportContentSchema,
   file: z
      .custom<FileList>()
      .refine(
         (files) =>
            files.length === 0 ||
            supportFilesSchema.safeParse(files[0]).success,
         {
            message: "파일은 10MB 이하로 업로드해주세요.",
         },
      )
      .optional(),
});

export type SupportFormSchema = z.infer<typeof supportFormSchema>;
