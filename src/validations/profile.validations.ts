import { z } from "zod";

export const moverProfileSchema = z.object({
  image: z.string().optional(),
  alias: z.string().min(1, "별명을 입력해주세요."),
  career: z
    .string()
    .min(1, "경력을 입력해주세요.") // 빈 문자열인지 체크 (처음부터 숫자로 하면 빈문자열을 0으로 인식함)
    .transform((val) => Number(val)) // 숫자로 변환
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "경력은 0 이상이어야 합니다.",
    }),
  onelineIntroduction: z.string().min(1, "한 줄 소개를 입력해주세요."),
  detailDescription: z.string().min(1, "상세 설명을 입력해주세요."),
  serviceType: z.array(z.string().min(1)).min(1, "제공 서비스를 선택해주세요."),
  area: z.array(z.string().min(1)).min(1, "서비스 지역을 선택해주세요."),
});

export type MoverProfileInput = z.infer<typeof moverProfileSchema>;
