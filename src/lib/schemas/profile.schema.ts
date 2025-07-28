import z from "zod";

//기사님 프로필 관련 사용 (career가 string)
export const MoverProfileSchema = z.object({
   image: z.string().optional(),
   nickName: z.string().min(1, "별명을 입력해주세요."),
   career: z
      .string()
      .min(1, "숫자만 입력해주세요.") // 빈 문자열인지 체크 (처음부터 숫자로 하면 빈문자열을 0으로 인식함)
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
         message: "경력은 0 이상이어야 합니다.",
      }),
   introduction: z.string().min(8, "8자 이상 입력해주세요."),
   description: z.string().min(10, "10자 이상 입력해주세요."),
   serviceType: z.array(z.string().min(1)).min(1, "* 1개 이상 선택해주세요."),
   serviceArea: z.array(z.string().min(1)).min(1, "* 1개 이상 선택해주세요."),
});

// 기사님 프로필 관련 API 전송용 타입 (career가 number)
export const MoverProfileRequestSchema = z.object({
   image: z.string().optional(),
   nickName: z.string(),
   career: z.number().min(0, "경력은 0 이상이어야 합니다."),
   introduction: z.string(),
   description: z.string(),
   serviceType: z.array(z.string()),
   serviceArea: z.array(z.string()),
});

export type MoverProfileRequestInput = z.infer<
   typeof MoverProfileRequestSchema
>;
export type MoverProfileInput = z.infer<typeof MoverProfileSchema>;
