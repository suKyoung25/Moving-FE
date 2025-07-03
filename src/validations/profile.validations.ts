import { z } from "zod";

export const moverProfileSchema = z.object({
  image: z.string().optional(),
  alias: z.string().min(1, "별명을 입력해주세요."),
  career: z.coerce.number().min(0, "경력은 0 이상이어야 합니다."),
  onelineIntoduction: z.string().min(1, "한 줄 소개를 입력해주세요."),
  detailDescription: z.string().min(1, "상세 설명을 입력해주세요."),
  serviceType: z.string().min(1, "제공 서비스를 입력해주세요."),
  area: z.string().min(1, "서비스 지역을 입력해주세요."),
});

export type MoverProfileInput = z.infer<typeof moverProfileSchema>;
