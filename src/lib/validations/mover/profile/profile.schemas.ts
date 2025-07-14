import z from "zod";

//기사님 프로필 등록 시 사용
export const moverProfileSchema = z.object({
  image: z.string().optional(),
  nickName: z.string().min(1, "별명을 입력해주세요."),
  career: z
    .string()
    .min(1, "숫자만 입력해주세요.") // 빈 문자열인지 체크 (처음부터 숫자로 하면 빈문자열을 0으로 인식함)
    .transform((val) => Number(val)) // 숫자로 변환
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "경력은 0 이상이어야 합니다.",
    }),
  onelineIntroduction: z.string().min(8, "8자 이상 입력해주세요."),
  detailDescription: z.string().min(10, "10자 이상 입력해주세요."),
  serviceType: z.array(z.string().min(1)).min(1, "* 1개 이상 선택해주세요."),
  area: z.array(z.string().min(1)).min(1, "* 1개 이상 선택해주세요."),
});

export type MoverProfileInput = z.input<typeof moverProfileSchema>;

//위 schema 재사용을 위한 export
export const profileSchemas = {
  nickName: moverProfileSchema.shape.nickName,
  career: moverProfileSchema.shape.career,
  onelineIntroduction: moverProfileSchema.shape.onelineIntroduction,
  detailDescription: moverProfileSchema.shape.detailDescription,
  serviceType: moverProfileSchema.shape.serviceType,
  area: moverProfileSchema.shape.area,
};
