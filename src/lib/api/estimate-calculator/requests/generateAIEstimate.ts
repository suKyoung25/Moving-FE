import { FormData, AIEstimateType } from "@/lib/types";
import { generateFallbackEstimate, parseAIResponse } from "@/lib/utils";

export async function generateAIEstimate(
   formData: FormData,
   distance: number,
): Promise<AIEstimateType> {
   try {
      const response = await fetch("/api/openai/generate-estimate", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ formData, distance }),
      });

      if (!response.ok) {
         throw new Error("AI 견적 생성에 실패했습니다.");
      }

      const data = await response.json();

      // AI 응답 검증 및 파싱
      let aiEstimate: AIEstimateType | null = null;

      if (data && typeof data === "object" && data.price !== undefined) {
         aiEstimate = data as AIEstimateType;
      } else if (data?.content && typeof data.content === "string") {
         aiEstimate = parseAIResponse(data.content, formData, distance);
      }

      // AI 견적이 유효한지 확인
      if (aiEstimate && aiEstimate.price > 0) {
         return aiEstimate;
      }

      // AI 응답이 유효하지 않거나 오차범위를 초과하면 fallback 사용
      return generateFallbackEstimate(formData, distance);
   } catch {
      return generateFallbackEstimate(formData, distance);
   }
}
