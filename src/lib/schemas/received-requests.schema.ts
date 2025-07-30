import { z } from "zod";

export const requestActionFormSchema = z
   .object({
      price: z.string().optional(),
      comment: z.string().min(10, "10자 이상 입력해 주세요."),
      modalType: z.enum(["accept", "reject"]),
   })
   .superRefine((data, ctx) => {
      if (data.modalType === "accept") {
         if (!data.price || data.price.trim() === "") {
            ctx.addIssue({
               code: "custom",
               path: ["price"],
               message: "금액을 입력해주세요.",
            });
            return;
         }

         const num = Number(data.price.replace(/,/g, ""));
         if (isNaN(num) || num <= 0 || num > 100_000_000) {
            ctx.addIssue({
               code: "custom",
               path: ["price"],
               message: "1 이상 100,000,000 이하의 숫자만 입력 가능합니다.",
            });
         }
      }
   });
export type RequestActionFormSchema = z.infer<typeof requestActionFormSchema>;
