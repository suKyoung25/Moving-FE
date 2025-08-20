import { useTranslations } from "next-intl";
import { z } from "zod";

export function useRequestActionFormSchema() {
   const t = useTranslations("Validations");

   const requestActionFormSchema = z
      .object({
         price: z.string().optional(),
         comment: z.string().min(10, t("commentMin")),
         modalType: z.enum(["accept", "reject"]),
      })
      .superRefine((data, ctx) => {
         if (data.modalType === "accept") {
            if (!data.price || data.price.trim() === "") {
               ctx.addIssue({
                  code: "custom",
                  path: ["price"],
                  message: t("priceRequired"),
               });
               return;
            }

            const num = Number(data.price.replace(/,/g, ""));
            if (isNaN(num) || num <= 0 || num > 100_000_000) {
               ctx.addIssue({
                  code: "custom",
                  path: ["price"],
                  message: t("priceRange"),
               });
            }
         }
      });
   return { requestActionFormSchema };
}
export type RequestActionFormSchema = z.infer<
   ReturnType<typeof useRequestActionFormSchema>["requestActionFormSchema"]
>;
