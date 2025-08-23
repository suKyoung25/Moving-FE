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

// 견적 계산 함수를 하나로 통일
export function calculateEstimate(formData: FormData, distance: number) {
   const basePrice = { SMALL: 40000, HOME: 80000, OFFICE: 100000 };
   const base = basePrice[formData.moveType as keyof typeof basePrice];
   const distanceFee = Math.max(distance, 1) * 1000;
   const weekendMultiplier = formData.isWeekend ? 1.2 : 1.0;
   const elevatorMultiplier = formData.hasElevator ? 1.0 : 1.15;
   const itemMultiplier =
      { few: 0.8, normal: 1.0, many: 1.3 }[formData.itemAmount] || 1.0;
   const floorMultiplier =
      { "1-3": 1.0, "4-7": 1.1, "8+": 1.2 }[formData.floorLevel] || 1.0;

   return {
      basePrice: base,
      distanceFee,
      weekendMultiplier,
      elevatorMultiplier,
      itemMultiplier,
      floorMultiplier,
      estimatedPrice: Math.round(
         (base + distanceFee) *
            weekendMultiplier *
            elevatorMultiplier *
            itemMultiplier *
            floorMultiplier,
      ),
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

   const estimate = calculateEstimate(formData, distance);
   const minPrice = Math.round(estimate.estimatedPrice * 0.9);
   const maxPrice = Math.round(estimate.estimatedPrice * 1.1);

   return `이사 견적을 계산해주세요.

이사 정보:
- 이사 유형: ${labels.moveType[formData.moveType as keyof typeof labels.moveType]}
- 거리: ${distance}km
- 날짜: ${formData.isWeekend ? "주말" : "평일"}
- 엘리베이터: ${formData.hasElevator ? "있음" : "계단 이용"}
- 짐의 양: ${labels.itemAmount[formData.itemAmount]}
- 층수: ${labels.floorLevel[formData.floorLevel]}

기본 견적: ${estimate.estimatedPrice.toLocaleString()}원

⚠️ 반드시 지켜야 할 규칙:
1. 최종 price는 ${minPrice.toLocaleString()}원 ~ ${maxPrice.toLocaleString()}원 사이여야 합니다
   - 이 범위를 벗어나는 금액은 잘못된 답변으로 간주됩니다
2. AI 견적은 기본 견적과 다를 수 있지만, 현실적인 근거가 있어야 합니다
3. 다음 요소들을 고려하여 견적을 조정할 수 있습니다:
   - 시장 동향 (수요/공급, 계절성)
   - 지역별 가격 차이
   - 특수 상황 (날씨, 교통 등)
   - 전문성과 서비스 품질
4. 모든 할증/할인은 이미 기본 견적에 반영되어 있지만, AI는 추가적인 현실적 요소를 고려하여 기본 견적 대비 높거나 낮도록 견적가를 조정할 수 있습니다
5. 같은 입력값(이사 정보)에 대해서는 항상 동일한 견적가가 산출되어야 합니다
6. JSON 이외의 어떤 텍스트도 출력하지 마세요
7. JSON 앞뒤에 설명 문장, 코드 블록 표시(\`\`\`json 등)도 절대 쓰지 마세요

문체 및 설명 스타일:
- 모든 설명은 "~니다", "~습니다" 등의 정중한 종결어를 사용하세요
- 견적 근거를 명확하고 상세하게 설명하세요
- AI가 고려한 추가 요소들을 구체적으로 명시하세요

견적 근거 설명 가이드라인:
- explanation: 전체 견적에 대한 종합적인 근거와 AI가 고려한 추가 요소들을 설명
- factors의 impact: 각 요인별로 구체적인 영향도와 AI의 분석 결과를 명시

응답 형식(JSON):
{
  "price": 견적 금액 (${minPrice.toLocaleString()}원 ~ ${maxPrice.toLocaleString()}원 범위),
  "explanation": 견적 근거 설명 (AI가 고려한 추가 요소 포함),
  "confidence": 신뢰도 (60-95),
  "factors": [
    {"factor": "이사유형", "impact": "구체적인 영향 설명 + AI 분석"},
    {"factor": "거리", "impact": "구체적인 영향 설명 + AI 분석"},
    {"factor": "날짜", "impact": "구체적인 영향 설명 + AI 분석"},
    {"factor": "엘리베이터", "impact": "구체적인 영향 설명 + AI 분석"},
    {"factor": "짐의 양", "impact": "구체적인 영향 설명 + AI 분석"},
    {"factor": "층수", "impact": "구체적인 영향 설명 + AI 분석"}
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
         console.warn("JSON 파싱 실패, 복구 시도:", parseError);

         // JSON 복구 시도
         const recoveredContent = recoverIncompleteJSON(
            cleanedContent,
            formData,
            distance,
         );
         try {
            parsed = JSON.parse(recoveredContent);
            console.log("JSON 복구 성공");
         } catch (recoveryError) {
            console.warn("JSON 복구 실패:", recoveryError);
            // 최종 fallback: 강제로 유효한 JSON 생성
            parsed = generateValidJSONFromContent(
               cleanedContent,
               formData,
               distance,
            );
         }
      }

      const estimate = calculateEstimate(formData, distance);
      const minPrice = Math.round(estimate.estimatedPrice * 0.9);
      const maxPrice = Math.round(estimate.estimatedPrice * 1.1);

      // 값 보정 (clamp)
      const clamp = (val: number, min: number, max: number) =>
         Math.min(Math.max(val, min), max);

      // 필수 필드 검증 및 기본값 설정
      const validatedEstimate = {
         price:
            parsed.price && typeof parsed.price === "number"
               ? clamp(parsed.price, minPrice, maxPrice)
               : estimate.estimatedPrice,
         explanation:
            parsed.explanation && typeof parsed.explanation === "string"
               ? parsed.explanation
               : "",
         confidence:
            parsed.confidence && typeof parsed.confidence === "number"
               ? Math.min(Math.max(parsed.confidence, 60), 95)
               : 75,
         factors:
            Array.isArray(parsed.factors) && parsed.factors.length > 0
               ? parsed.factors
               : [],
      };

      return validatedEstimate;
   } catch (error) {
      console.error("AI 응답 파싱 실패:", error);
      return generateFallbackEstimate(formData, distance);
   }
}

// JSON 복구 함수
function recoverIncompleteJSON(
   content: string,
   formData: FormData,
   distance: number,
): string {
   let recovered = content.trim();

   // 불완전한 문자열 값 복구
   const incompleteStringRegex = /"([^"]*)$/;
   if (incompleteStringRegex.test(recovered)) {
      recovered = recovered.replace(/"([^"]*)$/, '""');
   }

   // 불완전한 숫자 값 복구
   const incompleteNumberRegex = /(\d+)$/;
   if (incompleteNumberRegex.test(recovered)) {
      recovered = recovered.replace(/(\d+)$/, "0");
   }

   // factors 배열이 불완전한 경우 복구
   if (recovered.includes('"factors": [') && !recovered.includes("]")) {
      const factorsStartIndex = recovered.indexOf('"factors": [') + 12;
      const remainingContent = recovered.substring(factorsStartIndex);

      if (!remainingContent.includes("]")) {
         // 입력값을 반영한 동적 factors 배열 생성
         const dynamicFactors = generateCompleteFactors(formData, distance);
         const factorsJson = dynamicFactors
            .map(
               (factor) =>
                  `{
            "factor": "${factor.factor}",
            "impact": "${factor.impact}"
          }`,
            )
            .join(",\n          ");

         const defaultFactors = `\n          ${factorsJson}\n        ]`;

         recovered = recovered.substring(0, factorsStartIndex) + defaultFactors;
      }
   }

   // 최종 JSON 객체 닫기
   if (!recovered.endsWith("}")) {
      recovered += "}";
   }

   // 중괄호 균형 맞추기
   const openBraces = (recovered.match(/\{/g) || []).length;
   const closeBraces = (recovered.match(/\}/g) || []).length;
   if (openBraces > closeBraces) {
      recovered += "}".repeat(openBraces - closeBraces);
   }

   // 대괄호 균형 맞추기
   const openBrackets = (recovered.match(/\[/g) || []).length;
   const closeBrackets = (recovered.match(/\]/g) || []).length;
   if (openBrackets > closeBrackets) {
      recovered += "]".repeat(openBrackets - closeBrackets);
   }

   console.log("JSON 복구 결과:", recovered);
   return recovered;
}

// 최종 fallback: 강제로 유효한 JSON 생성
function generateValidJSONFromContent(
   content: string,
   formData: FormData,
   distance: number,
): AIEstimateType {
   console.log("강제 JSON 생성 시도");

   // calculateEstimate 함수 사용으로 통일
   const estimate = calculateEstimate(formData, distance);

   // content에서 숫자 추출 시도
   let extractedPrice = estimate.estimatedPrice;
   const priceMatch = content.match(/"price":\s*(\d+)/);
   if (priceMatch) {
      const price = parseInt(priceMatch[1]);
      if (!isNaN(price) && price > 0) {
         extractedPrice = price;
      }
   }

   // content에서 설명 추출 시도
   let extractedExplanation = "";
   const explanationMatch = content.match(/"explanation":\s*"([^"]*)"/);
   if (explanationMatch) {
      extractedExplanation =
         explanationMatch[1] ||
         "AI 견적 생성에 실패하여 기본 계산 공식으로 견적을 생성했습니다.";
   } else {
      extractedExplanation =
         "AI 견적 생성에 실패하여 기본 계산 공식으로 견적을 생성했습니다.";
   }

   // content에서 신뢰도 추출 시도
   let extractedConfidence = 75;
   const confidenceMatch = content.match(/"confidence":\s*(\d+)/);
   if (confidenceMatch) {
      const confidence = parseInt(confidenceMatch[1]);
      if (!isNaN(confidence) && confidence >= 60 && confidence <= 95) {
         extractedConfidence = confidence;
      }
   }

   // factors 추출 시도
   let extractedFactors: Array<{ factor: string; impact: string }> = [];
   if (content.includes('"factors": [')) {
      const factorsStart = content.indexOf('"factors": [') + 12;
      const factorsEnd = content.indexOf("]", factorsStart);

      if (factorsEnd > factorsStart) {
         const factorsContent = content.substring(factorsStart, factorsEnd);
         // 간단한 factor 추출
         const factorMatches = factorsContent.match(/"factor":\s*"([^"]*)"/g);
         if (factorMatches && factorMatches.length > 0) {
            extractedFactors = factorMatches.map((match) => {
               const factor =
                  match.match(/"factor":\s*"([^"]*)"/)?.[1] || "기타";
               return {
                  factor,
                  impact: "해당 요인은 기본 견적에 반영되었습니다.",
               };
            });
         }
      }
   }

   // factors가 비어있으면 기본값 생성
   if (extractedFactors.length === 0) {
      extractedFactors = generateCompleteFactors(formData, distance);
   }

   return {
      price: extractedPrice,
      explanation: extractedExplanation,
      confidence: extractedConfidence,
      factors: extractedFactors,
   };
}

// AI 응답 스타일의 개선된 fallback 견적 생성
export function generateFallbackEstimate(
   formData: FormData,
   distance: number,
): AIEstimateType {
   const estimate = calculateEstimate(formData, distance);

   return {
      price: estimate.estimatedPrice,
      explanation:
         "AI 견적 생성에 실패하여 기본 계산 공식으로 견적을 생성했습니다. 이는 AI가 분석한 견적이 아닌 시스템에서 자동 계산된 견적입니다.",
      confidence: 70,
      factors: generateCompleteFactors(formData, distance),
   };
}

// factors 배열 생성
function generateCompleteFactors(formData: FormData, distance: number) {
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

   return [
      {
         factor: "이사유형",
         impact: `${labels.moveType[formData.moveType as keyof typeof labels.moveType]}는 기본 요금이 적용되며, 전문적인 서비스 수준과 장비 비용을 고려한 요금입니다.`,
      },
      {
         factor: "거리",
         impact: `${distance}km 거리는 연료비, 시간, 인건비를 고려하여 km당 1,000원의 추가 요금이 적용되어 총 ${((distance * 1000) / 10000).toFixed(1)}만원이 추가되었습니다.`,
      },
      {
         factor: "날짜",
         impact: formData.isWeekend
            ? "주말 이사는 인력 비용 증가와 수요 증가로 인해 20% 할증이 적용되었습니다."
            : "평일 이사는 표준 요금이 적용되어 기본 견적에 반영되었습니다.",
      },
      {
         factor: "엘리베이터",
         impact: formData.hasElevator
            ? "엘리베이터 이용은 작업 효율성을 높여 기본 요금이 유지되며, 빠른 물품 이동이 가능합니다."
            : "계단 이용은 추가 노동력과 시간이 필요하여 15% 할증이 적용되었습니다.",
      },
      {
         factor: "짐양",
         impact: `${labels.itemAmount[formData.itemAmount]}은 ${formData.itemAmount === "few" ? "작업 시간 단축으로 20% 할인이 적용되어" : formData.itemAmount === "many" ? "추가 인력과 시간이 필요하여 30% 할증이 적용되어" : "표준 작업량으로 기본 요금이 적용되어"} 기본 견적에 반영되었습니다.`,
      },
      {
         factor: "층수",
         impact: `${labels.floorLevel[formData.floorLevel]}은 ${formData.floorLevel === "1-3" ? "낮은 층수로 기본 요금이 적용되며, 작업 난이도가 낮습니다." : formData.floorLevel === "4-7" ? "중간 층수로 10% 할증이 적용되어" : "높은 층수로 20% 할증이 적용되어"} 기본 견적에 반영되었습니다.`,
      },
   ];
}
