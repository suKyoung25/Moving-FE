import { useTranslations } from "next-intl";
import { z } from "zod";

export function useSupportFormSchema() {
   const t = useTranslations("Validations");

   const base = z.string().trim();

   const supportNameSchema = base
      .min(2, t("supportNameMin"))
      .max(8, t("supportNameMax"));

   const supportEmailSchema = base
      .email(t("invalidEmail"))
      .min(8, t("supportEmailMin"))
      .max(50, t("supportEmailMax"));

   const supportTitleSchema = base
      .min(2, t("supportTitleMin"))
      .max(50, t("supportTitleMax"))
      .regex(/^(?!.*<.*?>).*$/, t("noHtmlAllowed"));

   const supportPhoneSchema = base
      .min(9, t("supportPhoneMin"))
      .max(20, t("supportPhoneMax"))
      .regex(
         /^(\+82\s?1[016789]-?\d{3,4}-?\d{4}|0\d{1,2}-?\d{3,4}-?\d{4})$/,
         t("phoneInvalid"),
      );

   const supportContentSchema = base
      .min(10, t("supportContentMin"))
      .max(2000, t("supportContentMax"))
      .regex(/^(?!.*<.*?>).*$/, t("noHtmlAllowed"));

   const supportFilesSchema = z
      .instanceof(File)
      .refine((file) => file.size <= 10 * 1024 * 1024, {
         message: t("fileMax10Mb"),
      });

   // ✅ 통합 폼 스키마
   const supportFormSchema = z.object({
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
               message: t("fileMax10Mb"),
            },
         )
         .optional(),
   });
   return { supportFormSchema };
}

export type SupportFormSchema = z.infer<
   ReturnType<typeof useSupportFormSchema>["supportFormSchema"]
>;
