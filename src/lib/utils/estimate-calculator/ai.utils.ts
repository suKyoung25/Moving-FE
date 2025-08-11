import { FormData, AIEstimateType } from "@/lib/types";

// OpenAI API 에러 처리 및 메시지 반환
export function handleOpenAIError(errorData: any, response: Response): never {
   const message = errorData.error?.message || "AI 견적 생성에 실패했습니다.";
   throw new Error(message);
}

// OpenAI API 응답 데이터 검증 및 content 추출
export function validateOpenAIResponse(data: any): string {
   if (!data?.choices?.[0]?.message?.content) {
      throw new Error("AI 응답 내용이 올바르지 않습니다.");
   }
   return data.choices[0].message.content;
}

// OpenAI API 요청 객체 생성
export function createOpenAIRequest(prompt: string, apiKey: string) {
   return {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
         model: "gpt-4",
         messages: [
            {
               role: "system",
               content:
                  "당신은 이사 견적 전문가입니다. 정확하고 현실적인 견적을 제공해주세요.",
            },
            { role: "user", content: prompt },
         ],
         temperature: 0.0,
         max_tokens: 500,
      }),
   };
}

// 이사 견적 생성을 위한 AI 프롬프트 구성
export function buildPrompt(formData: FormData, distance: number): string {
   const labels = {
      moveType: {
         SMALL: "소형 이사",
         HOME: "가정집 이사",
         OFFICE: "사무실 이사",
      },
      itemAmount: {
         few: "최소한의 짐",
         normal: "일반적인 양",
         many: "많은 가구/짐",
      },
      floorLevel: { "1-3": "1-3층", "4-7": "4-7층", "8+": "8층 이상" },
   };

   // 기본 견적 계산을 위한 기본값
   const basePrice = { SMALL: 40000, HOME: 80000, OFFICE: 100000 };
   const base = basePrice[formData.moveType as keyof typeof basePrice];
   const distanceFee = Math.max(distance, 1) * 1000;
   const weekendMultiplier = formData.isWeekend ? 1.2 : 1.0;
   const elevatorMultiplier = formData.hasElevator ? 1.0 : 1.15;
   const itemMultiplier =
      { few: 0.8, normal: 1.0, many: 1.3 }[formData.itemAmount] || 1.0;
   const floorMultiplier =
      { "1-3": 1.0, "4-7": 1.1, "8+": 1.2 }[formData.floorLevel] || 1.0;

   const estimatedBasePrice = Math.round(
      (base + distanceFee) *
         weekendMultiplier *
         elevatorMultiplier *
         itemMultiplier *
         floorMultiplier,
   );

   return `이사 견적을 계산해주세요. 다음 정보를 바탕으로 현실적이고 합리적인 견적을 제시해주세요.

이사 정보:
- 이사 유형: ${labels.moveType[formData.moveType as keyof typeof labels.moveType]}
- 거리: ${distance}km
- 날짜: ${formData.isWeekend ? "주말" : "평일"}
- 엘리베이터: ${formData.hasElevator ? "있음" : "계단 이용"}
- 짐의 양: ${labels.itemAmount[formData.itemAmount]}
- 층수: ${labels.floorLevel[formData.floorLevel]}

참고 견적: ${estimatedBasePrice.toLocaleString()}원 (기본 계산 기준)
허용 오차범위: ${Math.round(estimatedBasePrice * 0.8).toLocaleString()}원 ~ ${Math.round(estimatedBasePrice * 1.2).toLocaleString()}원 (±20%)

견적 설정 규칙:
1. 견적은 반드시 허용 오차범위 내에 있어야 합니다
2. 같은 입력값에 대해서는 항상 동일한 견적을 생성해야 합니다
3. 각 요인별 영향도를 고려하여 견적을 조정하세요:
   - 거리: ${distance > 30 ? "30km 초과 시 +10~15%" : "적정 거리 시 ±0%"}
   - 주말: ${formData.isWeekend ? "할증 +15~20%" : "평일 ±0%"}
   - 엘리베이터: ${!formData.hasElevator ? "계단 이용 +10~15%" : "엘리베이터 -5~10%"}
   - 짐의 양: ${formData.itemAmount === "many" ? "많은 짐 +15~20%" : formData.itemAmount === "few" ? "적은 짐 -10~15%" : "일반적인 양 ±0%"}
   - 층수: ${formData.floorLevel === "8+" ? "8층 이상 +15~20%" : formData.floorLevel === "4-7" ? "4-7층 +5~10%" : "1-3층 ±0%"}

문체 및 설명 스타일:
- 모든 설명은 "~니다", "~습니다" 등의 정중한 종결어를 사용하세요
- 견적 근거를 명확하고 이해하기 쉽게 설명하세요
- 각 요인별로 구체적인 영향도를 제시하세요

응답 형식:
{
  "price": 견적 금액 (숫자, 콤마 없이),
  "explanation": 견적 근거 설명 (한국어),
  "confidence": 신뢰도 (60-95 사이 숫자),
  "factors": [
    {
      "factor": "요인명",
      "impact": "영향 설명"
    }
  ]
}

주의: 
1. price는 반드시 숫자로만 작성하고 콤마(,)를 사용하지 마세요.
2. price는 반드시 허용 오차범위 내에 있어야 합니다.
3. 같은 입력값에 대해 일관된 견적을 생성해야 합니다.
4. 각 요인별 영향도를 합리적으로 적용하여 견적을 계산하세요.
5. 모든 설명은 정중하고 이해하기 쉬운 문체로 작성하세요.`;
}

// AI 응답 JSON 파싱 및 AIEstimateType 변환
export function parseAIResponse(
   content: string,
   formData: FormData,
   distance: number,
): AIEstimateType {
   try {
      if (!content || typeof content !== "string") {
         console.error(
            "parseAIResponse: content가 유효하지 않음:",
            typeof content,
            content,
         );
         return generateFallbackEstimate(formData, distance);
      }

      const cleanedContent = content.replace(/(\d+),(\d+)/g, "$1$2");
      const parsed = JSON.parse(cleanedContent);

      return {
         price: parsed.price || 0,
         explanation: parsed.explanation || "",
         confidence: Math.min(Math.max(parsed.confidence || 75, 60), 95),
         factors: parsed.factors || [],
      };
   } catch (error) {
      console.error("AI 응답 파싱 실패:", error);
      console.error("원본 콘텐츠:", content);
      console.error("콘텐츠 타입:", typeof content);
      return generateFallbackEstimate(formData, distance);
   }
}

// AI 분석 실패 시 기본 견적 계산
export function generateFallbackEstimate(
   formData: FormData,
   distance: number,
): AIEstimateType {
   const basePrice = { SMALL: 40000, HOME: 80000, OFFICE: 100000 };
   const base = basePrice[formData.moveType as keyof typeof basePrice];
   const distanceFee = Math.max(distance, 1) * 1000;

   const multipliers = {
      weekend: formData.isWeekend ? 1.2 : 1.0,
      elevator: formData.hasElevator ? 1.0 : 1.15,
      item: { few: 0.8, normal: 1.0, many: 1.3 }[formData.itemAmount] || 1.0,
      floor: { "1-3": 1.0, "4-7": 1.1, "8+": 1.2 }[formData.floorLevel] || 1.0,
   };

   const estimatedPrice = Math.round(
      (base + distanceFee) *
         Object.values(multipliers).reduce((a, b) => a * b, 1),
   );

   return {
      price: estimatedPrice,
      explanation: "AI 분석에 실패하여 기본 계산 방식을 사용했습니다.",
      confidence: 75,
      factors: [
         { factor: "거리", impact: distance > 30 ? "상승요인" : "적정" },
         {
            factor: "이사유형",
            impact: formData.moveType === "OFFICE" ? "할증" : "표준",
         },
         { factor: "날짜", impact: formData.isWeekend ? "할증적용" : "표준" },
         {
            factor: "건물조건",
            impact: formData.hasElevator ? "절약요인" : "추가비용",
         },
         {
            factor: "층수",
            impact: formData.floorLevel === "8+" ? "할증" : "표준",
         },
      ],
   };
}
