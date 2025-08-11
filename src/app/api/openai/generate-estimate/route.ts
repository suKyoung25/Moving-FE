import {
   buildPrompt,
   createOpenAIRequest,
   generateFallbackEstimate,
   handleOpenAIError,
   parseAIResponse,
   validateOpenAIResponse,
} from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
   if (!OPENAI_API_KEY) {
      return NextResponse.json(
         { error: "OpenAI API key not configured" },
         { status: 500 },
      );
   }

   try {
      const { formData, distance } = await request.json();

      const prompt = buildPrompt(formData, distance);

      const response = await fetch(
         "https://api.openai.com/v1/chat/completions",
         createOpenAIRequest(prompt, OPENAI_API_KEY),
      );

      if (!response.ok) {
         const errorData = await response.json();

         // 할당량 부족 시 fallback 견적 반환
         if (errorData.error?.code === "insufficient_quota") {
            const fallbackEstimate = generateFallbackEstimate(
               formData,
               distance,
            );
            return NextResponse.json(fallbackEstimate);
         }

         // 기타 OpenAI 에러 처리
         handleOpenAIError(errorData, response);
      }

      const data = await response.json();
      const content = validateOpenAIResponse(data);
      const estimate = parseAIResponse(content, formData, distance);

      return NextResponse.json(estimate);
   } catch (error) {
      console.error("OpenAI API error:", error);

      // 할당량 부족 에러인 경우 fallback 견적 반환
      if (error instanceof Error && error.message === "QUOTA_EXCEEDED") {
         try {
            const { formData, distance } = await request.json();
            const fallbackEstimate = generateFallbackEstimate(
               formData,
               distance,
            );
            return NextResponse.json(fallbackEstimate);
         } catch (fallbackError) {
            console.error("Fallback 견적 생성 실패:", fallbackError);
         }
      }

      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 },
      );
   }
}
