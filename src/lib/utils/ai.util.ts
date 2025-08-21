import { FormData, AIEstimateType } from "@/lib/types";

// OpenAI API 에러 처리 및 메시지 반환
export function handleOpenAIError(errorData: unknown) {
   const message =
      errorData &&
      typeof errorData === "object" &&
      "error" in errorData &&
      errorData.error &&
      typeof errorData.error === "object" &&
      "message" in errorData.error
         ? String(errorData.error.message)
         : "AI 견적 생성에 실패했습니다.";
   throw new Error(message);
}

// OpenAI API 응답 데이터 검증 및 content 추출
export function validateOpenAIResponse(data: unknown): string {
   if (
      !data ||
      typeof data !== "object" ||
      !("choices" in data) ||
      !Array.isArray(data.choices) ||
      !data.choices[0] ||
      typeof data.choices[0] !== "object" ||
      !("message" in data.choices[0]) ||
      !data.choices[0].message ||
      typeof data.choices[0].message !== "object" ||
      !("content" in data.choices[0].message)
   ) {
      throw new Error("AI 응답 내용이 올바르지 않습니다.");
   }
   return String(data.choices[0].message.content);
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
         model: "gpt-3.5-turbo",
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

   return `이사 견적을 계산해주세요.

이사 정보:
- 이사 유형: ${labels.moveType[formData.moveType as keyof typeof labels.moveType]}
- 거리: ${distance}km
- 날짜: ${formData.isWeekend ? "주말" : "평일"}
- 엘리베이터: ${formData.hasElevator ? "있음" : "계단 이용"}
- 짐의 양: ${labels.itemAmount[formData.itemAmount]}
- 층수: ${labels.floorLevel[formData.floorLevel]}

기본 견적: ${estimatedBasePrice.toLocaleString()}원

⚠️ 중요: 기본 견적에 이미 모든 할증/할인이 포함되어 있습니다.

규칙:
1. 최종 견적은 기본 견적의 90%~110% 범위 내에 있어야 합니다
2. 추가 할증/할인 금지
3. 각 요인별로 구체적이고 상세한 설명 제공

응답 형식:
{
  "price": 견적 금액 (${Math.round(estimatedBasePrice * 0.9).toLocaleString()}원 ~ ${Math.round(estimatedBasePrice * 1.1).toLocaleString()}원 범위),
  "explanation": 견적 근거 설명 (상세한 한국어 설명),
  "confidence": 신뢰도 (60-95),
  "factors": [
    {"factor": "이사유형", "impact": "구체적인 영향 설명"},
    {"factor": "거리", "impact": "구체적인 영향 설명"},
    {"factor": "날짜", "impact": "구체적인 영향 설명"},
    {"factor": "엘리베이터", "impact": "구체적인 영향 설명"},
    {"factor": "짐양", "impact": "구체적인 영향 설명"},
    {"factor": "층수", "impact": "구체적인 영향 설명"}
  ]
}`;
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

      // AI 응답에서 "원" 문자와 콤마 제거
      const cleanedContent = content
         .replace(/(\d+),(\d+)/g, "$1$2") // 숫자 사이 콤마 제거
         .replace(/(\d+)원/g, "$1") // "원" 문자 제거
         .replace(/,\s*}/g, "}") // 마지막 콤마 제거
         .replace(/,\s*]/g, "]"); // 배열 마지막 콤마 제거

      // JSON 파싱 시도
      let parsed;
      try {
         parsed = JSON.parse(cleanedContent);
      } catch (parseError) {
         console.warn("JSON 파싱 실패, 복구 시도 중...", parseError);

         // JSON 복구 시도
         const recoveredContent = recoverIncompleteJSON(cleanedContent);
         try {
            parsed = JSON.parse(recoveredContent);
            console.log("JSON 복구 성공!");
         } catch (recoveryError) {
            console.error("JSON 복구 실패:", recoveryError);
            console.error("원본 콘텐츠:", content);
            console.error("복구 시도 콘텐츠:", recoveredContent);
            return generateFallbackEstimate(formData, distance);
         }
      }

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

// 불완전한 JSON 응답 복구 함수
function recoverIncompleteJSON(content: string): string {
   let recovered = content.trim();

   // factors 배열이 불완전한 경우 복구
   if (recovered.includes('"factors": [') && !recovered.endsWith("]")) {
      // factors 배열 닫기
      if (!recovered.includes("]")) {
         recovered += "]";
      }

      // JSON 객체 닫기
      if (!recovered.endsWith("}")) {
         recovered += "}";
      }
   }

   // 불완전한 문자열 값 복구
   const incompleteStringRegex = /"([^"]*)$/;
   if (incompleteStringRegex.test(recovered)) {
      // 불완전한 문자열을 빈 문자열로 완성
      recovered = recovered.replace(/"([^"]*)$/, '""');
   }

   // 불완전한 숫자 값 복구
   const incompleteNumberRegex = /(\d+)$/;
   if (incompleteNumberRegex.test(recovered)) {
      // 불완전한 숫자를 0으로 완성
      recovered = recovered.replace(/(\d+)$/, "0");
   }

   // 불완전한 객체나 배열 복구
   if (recovered.includes('"factors": [') && !recovered.includes("]")) {
      // factors 배열이 불완전한 경우 기본 factors 추가
      const factorsEndIndex = recovered.indexOf('"factors": [') + 12;
      const remainingContent = recovered.substring(factorsEndIndex);

      if (!remainingContent.includes("]")) {
         // 기본 factors 배열 완성
         const defaultFactors = `{
            "factor": "이사유형",
            "impact": "기본 견적에 반영된 요인"
          },
          {
            "factor": "거리",
            "impact": "기본 견적에 반영된 요인"
          },
          {
            "factor": "날짜",
            "impact": "기본 견적에 반영된 요인"
          },
          {
            "factor": "엘리베이터",
            "impact": "기본 견적에 반영된 요인"
          },
          {
            "factor": "짐양",
            "impact": "기본 견적에 반영된 요인"
          },
          {
            "factor": "층수",
            "impact": "기본 견적에 반영된 요인"
          }]}`;

         recovered = recovered.substring(0, factorsEndIndex) + defaultFactors;
      }
   }

   // 최종 JSON 객체 닫기
   if (!recovered.endsWith("}")) {
      recovered += "}";
   }

   console.log("JSON 복구 결과:", recovered);
   return recovered;
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
