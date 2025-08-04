"use client";

import React, { useState, useCallback } from "react";
// Material Design
import {
   MdLocalShipping,
   MdArrowForward,
   MdAccessTime,
   MdAttachMoney,
   MdPsychology,
   MdRefresh,
   MdHome,
   MdBusiness,
   MdStorefront,
   MdStar,
   MdTrendingUp,
   MdCalculate,
   MdInfo,
   MdFlashOn,
   MdAddTask,
} from "react-icons/md";

// Types
interface FormData {
   moveType: "SMALL" | "HOME" | "OFFICE" | "";
   fromAddress: string;
   toAddress: string;
   moveDate: string;
   isWeekend: boolean;
   hasElevator: boolean;
   itemAmount: "few" | "normal" | "many";
   floorLevel: "1-3" | "4-7" | "8+";
}

interface AIEstimate {
   price: number;
   explanation: string;
   confidence: number;
   factors: Array<{
      factor: string;
      impact: string;
   }>;
}

interface MoveTypeOption {
   id: "SMALL" | "HOME" | "OFFICE";
   title: string;
   desc: string;
   price: string;
   icon: React.ReactNode;
}

interface PriceBreakdown {
   basePrice: number;
   distanceFee: number;
   weekendSurcharge: number;
   elevatorAdjustment: number;
   itemAdjustment: number;
   total: number;
}

// API Service
class OpenAIService {
   private static readonly API_URL =
      "https://api.openai.com/v1/chat/completions";
   private static readonly API_KEY =
      process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

   static async generateEstimate(
      formData: FormData,
      distance: number,
   ): Promise<AIEstimate> {
      const prompt = this.buildPrompt(formData, distance);

      try {
         const response = await fetch(this.API_URL, {
            method: "POST",
            headers: {
               Authorization: `Bearer ${this.API_KEY}`,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               model: "gpt-4",
               messages: [
                  {
                     role: "system",
                     content:
                        "당신은 한국의 이사 업계 전문가입니다. 다양한 요소를 고려하여 정확한 이사 견적을 제공해주세요.",
                  },
                  {
                     role: "user",
                     content: prompt,
                  },
               ],
               temperature: 0.7,
               max_tokens: 500,
            }),
         });

         if (!response.ok) {
            throw new Error(`OpenAI API Error: ${response.status}`);
         }

         const data = await response.json();
         const content = data.choices[0]?.message?.content;

         return this.parseAIResponse(content);
      } catch (error) {
         console.error("OpenAI API 호출 실패:", error);
         // 실패시 시뮬레이션 데이터 반환
         return this.generateFallbackEstimate(formData, distance);
      }
   }

   private static buildPrompt(formData: FormData, distance: number): string {
      const moveTypeKorean = {
         SMALL: "소형이사(원룸/투룸)",
         HOME: "가정이사(아파트/주택)",
         OFFICE: "사무실이사",
      };

      const itemAmountKorean = {
         few: "적음",
         normal: "보통",
         many: "많음",
      };

      return `
한국 이사 견적을 요청합니다:

- 출발지: ${formData.fromAddress}
- 도착지: ${formData.toAddress}
- 거리: 약 ${distance}km
- 이사 유형: ${moveTypeKorean[formData.moveType as keyof typeof moveTypeKorean]}
- 엘리베이터: ${formData.hasElevator ? "있음" : "없음"}
- 짐의 양: ${itemAmountKorean[formData.itemAmount]}
- 층수: ${formData.floorLevel}층
- 이사 날짜: ${formData.isWeekend ? "주말" : "평일"}

2024년 한국 이사 시장 기준으로 예상 견적을 JSON 형식으로 제공해주세요:
{
  "price": 예상금액(숫자만),
  "explanation": "간단한 설명 1-2문장",
  "confidence": 신뢰도(85-95 사이),
  "factors": [
    {"factor": "거리", "impact": "적정/상승요인/절약요인"},
    {"factor": "이사유형", "impact": "표준/할증"},
    {"factor": "날짜", "impact": "표준/할증적용"},
    {"factor": "건물조건", "impact": "절약요인/추가비용"}
  ]
}
`;
   }

   private static parseAIResponse(content: string): AIEstimate {
      try {
         // JSON 부분만 추출
         const jsonMatch = content.match(/\{[\s\S]*\}/);
         if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
         }
         throw new Error("JSON 파싱 실패");
      } catch (error) {
         console.error("AI 응답 파싱 실패:", error);
         throw error;
      }
   }

   private static generateFallbackEstimate(
      formData: FormData,
      distance: number,
   ): AIEstimate {
      const basePrice = { SMALL: 40000, HOME: 80000, OFFICE: 100000 };
      const base = basePrice[formData.moveType as keyof typeof basePrice];
      const estimatedPrice =
         base + distance * 1000 * (formData.isWeekend ? 1.2 : 1.0);

      return {
         price: Math.round(estimatedPrice),
         explanation: "네트워크 오류로 기본 계산 방식을 사용했습니다.",
         confidence: 75,
         factors: [
            { factor: "거리", impact: distance > 30 ? "상승요인" : "적정" },
            { factor: "이사유형", impact: "표준" },
            {
               factor: "날짜",
               impact: formData.isWeekend ? "할증적용" : "표준",
            },
            {
               factor: "건물조건",
               impact: formData.hasElevator ? "절약요인" : "추가비용",
            },
         ],
      };
   }
}

// Utility functions
const formatPrice = (price: number): string => {
   return new Intl.NumberFormat("ko-KR").format(price);
};

const calculateBasicEstimate = (
   formData: FormData,
   distance: number,
): PriceBreakdown => {
   const basePrice = { SMALL: 40000, HOME: 80000, OFFICE: 100000 };

   if (!formData.moveType || !distance) {
      return {
         basePrice: 0,
         distanceFee: 0,
         weekendSurcharge: 0,
         elevatorAdjustment: 0,
         itemAdjustment: 0,
         total: 0,
      };
   }

   const base = basePrice[formData.moveType];
   const distanceFee = distance * 1000;
   const subtotal = base + distanceFee;

   const weekendMultiplier = formData.isWeekend ? 0.2 : 0;
   const elevatorMultiplier = formData.hasElevator ? 0 : 0.15;
   const itemMultiplier =
      formData.itemAmount === "many"
         ? 0.3
         : formData.itemAmount === "few"
           ? -0.2
           : 0;

   const weekendSurcharge = subtotal * weekendMultiplier;
   const elevatorAdjustment = subtotal * elevatorMultiplier;
   const itemAdjustment = subtotal * itemMultiplier;

   const total = Math.round(
      subtotal + weekendSurcharge + elevatorAdjustment + itemAdjustment,
   );

   return {
      basePrice: base,
      distanceFee,
      weekendSurcharge,
      elevatorAdjustment,
      itemAdjustment,
      total,
   };
};

// Mock function to simulate distance calculation
const calculateDistance = async (from: string, to: string): Promise<number> => {
   // 실제로는 Google Maps API나 다른 지도 서비스를 사용
   await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기
   return Math.floor(Math.random() * 50) + 5; // 5-55km 랜덤 거리
};

// Components
const MoveTypeSelector: React.FC<{
   selectedType: string;
   onTypeSelect: (type: "SMALL" | "HOME" | "OFFICE") => void;
}> = ({ selectedType, onTypeSelect }) => {
   const moveTypes: MoveTypeOption[] = [
      {
         id: "SMALL",
         title: "소형이사",
         desc: "원룸, 투룸",
         price: "4만원~",
         icon: <MdHome className="mb-2 h-6 w-6" />,
      },
      {
         id: "HOME",
         title: "가정이사",
         desc: "아파트, 주택",
         price: "8만원~",
         icon: <MdBusiness className="mb-2 h-6 w-6" />,
      },
      {
         id: "OFFICE",
         title: "사무실이사",
         desc: "상가, 오피스",
         price: "10만원~",
         icon: <MdStorefront className="mb-2 h-6 w-6" />,
      },
   ];

   return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
         <div className="mb-4 flex items-center gap-2">
            <MdLocalShipping className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">이사 유형</h2>
         </div>

         <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {moveTypes.map((type) => (
               <div
                  key={type.id}
                  onClick={() => onTypeSelect(type.id)}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                     selectedType === type.id
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
               >
                  <div className="flex justify-center text-blue-600">
                     {type.icon}
                  </div>
                  <h3 className="mb-1 text-center text-sm font-medium">
                     {type.title}
                  </h3>
                  <p className="text-black-400 mb-2 text-center text-xs">
                     {type.desc}
                  </p>
                  <p className="text-center text-xs font-medium text-blue-600">
                     {type.price}
                  </p>
               </div>
            ))}
         </div>
      </div>
   );
};

const AddressInput: React.FC<{
   fromAddress: string;
   toAddress: string;
   distance: number;
   isCalculating: boolean;
   onAddressChange: (field: "fromAddress" | "toAddress", value: string) => void;
}> = ({ fromAddress, toAddress, distance, isCalculating, onAddressChange }) => {
   return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
         <div className="mb-4 flex items-center gap-2">
            <MdLocalShipping className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">출발지 & 도착지</h2>
         </div>

         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
               <label className="mb-2 block text-sm font-medium text-gray-700">
                  출발지
               </label>
               <input
                  type="text"
                  value={fromAddress}
                  onChange={(e) =>
                     onAddressChange("fromAddress", e.target.value)
                  }
                  placeholder="예: 서울특별시 강남구 테헤란로 123"
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
               />
            </div>

            <div>
               <label className="mb-2 block text-sm font-medium text-gray-700">
                  도착지
               </label>
               <input
                  type="text"
                  value={toAddress}
                  onChange={(e) => onAddressChange("toAddress", e.target.value)}
                  placeholder="예: 서울특별시 마포구 월드컵로 456"
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
               />
            </div>
         </div>

         {isCalculating && (
            <div className="mt-4 flex items-center gap-2 text-blue-600">
               <MdRefresh className="h-4 w-4 animate-spin" />
               <span className="text-sm">거리를 계산하고 있습니다...</span>
            </div>
         )}

         {distance > 0 && !isCalculating && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3">
               <MdArrowForward className="h-4 w-4 text-blue-600" />
               <span className="text-sm text-blue-800">
                  <strong>예상 거리:</strong> 약 {distance}km
               </span>
            </div>
         )}
      </div>
   );
};

const AdditionalMdInfoForm: React.FC<{
   formData: FormData;
   onInputChange: (
      field: keyof FormData,
      value: string | number | boolean,
   ) => void;
   onDateChange: (date: string) => void;
}> = ({ formData, onInputChange, onDateChange }) => {
   return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
         <div className="mb-4 flex items-center gap-2">
            <MdAddTask className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">
               추가 정보 (더 정확한 AI 견적을 위해)
            </h2>
         </div>

         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
               <label className="mb-2 block text-sm font-medium text-gray-700">
                  엘리베이터 여부
               </label>
               <select
                  value={formData.hasElevator.toString()}
                  onChange={(e) =>
                     onInputChange("hasElevator", e.target.value === "true")
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
               >
                  <option value="true">엘리베이터 있음</option>
                  <option value="false">계단 이용</option>
               </select>
            </div>

            <div>
               <label className="mb-2 block text-sm font-medium text-gray-700">
                  짐의 양
               </label>
               <select
                  value={formData.itemAmount}
                  onChange={(e) => onInputChange("itemAmount", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
               >
                  <option value="few">적음 (최소한의 짐)</option>
                  <option value="normal">보통 (일반적인 양)</option>
                  <option value="many">많음 (많은 가구/짐)</option>
               </select>
            </div>

            <div>
               <label className="mb-2 block text-sm font-medium text-gray-700">
                  층수
               </label>
               <select
                  value={formData.floorLevel}
                  onChange={(e) => onInputChange("floorLevel", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
               >
                  <option value="1-3">1-3층</option>
                  <option value="4-7">4-7층</option>
                  <option value="8+">8층 이상</option>
               </select>
            </div>

            <div>
               <label className="mb-2 block text-sm font-medium text-gray-700">
                  이사 날짜
               </label>
               <input
                  type="date"
                  value={formData.moveDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
               />
            </div>
         </div>

         {formData.moveDate && (
            <div
               className={`mt-4 rounded-lg p-3 text-sm ${
                  formData.isWeekend
                     ? "border border-orange-200 bg-orange-50 text-orange-800"
                     : "border border-green-200 bg-green-50 text-green-800"
               }`}
            >
               <div className="flex items-center gap-2">
                  <MdAccessTime className="h-4 w-4" />
                  <span className="font-medium">
                     {formData.isWeekend ? "주말 이사" : "평일 이사"}
                  </span>
               </div>
               <p className="mt-1 text-xs">
                  {formData.isWeekend ? "할증료 20% 적용" : "기본 요금 적용"}
               </p>
            </div>
         )}
      </div>
   );
};

const BasicEstimateView: React.FC<{
   breakdown: PriceBreakdown;
}> = ({ breakdown }) => {
   return (
      <>
         <div className="mb-4 flex items-center gap-2">
            <MdAttachMoney className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">기본 견적</h2>
         </div>

         <div className="mb-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            <div className="text-center">
               <p className="text-black-400 mb-1 text-sm">예상 비용</p>
               <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(breakdown.total)}원
               </p>
            </div>
         </div>

         <div className="mb-4 rounded-lg border border-gray-100 p-4">
            <h3 className="mb-3 text-sm font-medium text-gray-700">
               견적 내역
            </h3>
            <div className="space-y-2 text-xs">
               <div className="flex justify-between">
                  <span className="text-black-400">기본료</span>
                  <span>{formatPrice(breakdown.basePrice)}원</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-black-400">거리비용</span>
                  <span>{formatPrice(breakdown.distanceFee)}원</span>
               </div>
               {breakdown.weekendSurcharge > 0 && (
                  <div className="flex justify-between text-orange-600">
                     <span>주말 할증</span>
                     <span>+{formatPrice(breakdown.weekendSurcharge)}원</span>
                  </div>
               )}
               {breakdown.elevatorAdjustment > 0 && (
                  <div className="flex justify-between text-red-600">
                     <span>계단 추가비용</span>
                     <span>+{formatPrice(breakdown.elevatorAdjustment)}원</span>
                  </div>
               )}
               {breakdown.itemAdjustment !== 0 && (
                  <div
                     className={`flex justify-between ${breakdown.itemAdjustment > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                     <span>짐 양 조정</span>
                     <span>
                        {breakdown.itemAdjustment > 0 ? "+" : ""}
                        {formatPrice(breakdown.itemAdjustment)}원
                     </span>
                  </div>
               )}
               <hr className="my-2" />
               <div className="flex justify-between font-medium">
                  <span>합계</span>
                  <span className="text-blue-600">
                     {formatPrice(breakdown.total)}원
                  </span>
               </div>
            </div>
         </div>
      </>
   );
};

const AIEstimateView: React.FC<{
   aiEstimate: AIEstimate | null;
   isLoading: boolean;
   onGenerate: () => void;
}> = ({ aiEstimate, isLoading, onGenerate }) => {
   return (
      <>
         <div className="mb-4 flex items-center gap-2">
            <MdPsychology className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold">AI 견적</h2>
         </div>

         {!aiEstimate ? (
            <div className="py-8 text-center">
               <button
                  onClick={onGenerate}
                  disabled={isLoading}
                  className="mx-auto flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
               >
                  {isLoading ? (
                     <>
                        <MdRefresh className="h-4 w-4 animate-spin" />
                        AI가 분석 중...
                     </>
                  ) : (
                     <>
                        <MdFlashOn className="h-4 w-4" />
                        AI 견적 받기
                     </>
                  )}
               </button>
               <p className="mt-2 text-xs text-gray-500">
                  AI가 시장 동향과 다양한 요소를 분석하여 더 정확한 견적을
                  제공합니다
               </p>
            </div>
         ) : (
            <>
               <div className="mb-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                  <div className="text-center">
                     <p className="text-black-400 mb-1 text-sm">AI 예상 비용</p>
                     <p className="text-2xl font-bold text-purple-600">
                        {formatPrice(aiEstimate.price)}원
                     </p>
                     <div className="mt-2 flex items-center justify-center gap-1">
                        <MdStar className="h-4 w-4 fill-current text-yellow-500" />
                        <span className="text-black-400 text-xs">
                           신뢰도 {aiEstimate.confidence}%
                        </span>
                     </div>
                  </div>
               </div>

               <div className="mb-4 rounded-lg border border-gray-100 p-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-700">
                     AI 분석 결과
                  </h3>
                  <p className="text-black-400 mb-3 text-xs">
                     {aiEstimate.explanation}
                  </p>

                  <div className="space-y-2">
                     {aiEstimate.factors.map((factor, index) => (
                        <div
                           key={index}
                           className="flex items-center justify-between text-xs"
                        >
                           <span className="text-black-400">
                              {factor.factor}
                           </span>
                           <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                 factor.impact.includes("상승") ||
                                 factor.impact.includes("할증")
                                    ? "bg-red-100 text-red-700"
                                    : factor.impact.includes("절약")
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                           >
                              {factor.impact}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>

               <button
                  onClick={onGenerate}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
               >
                  <MdRefresh className="h-3 w-3" />
                  다시 분석하기
               </button>
            </>
         )}
      </>
   );
};

const ComparisonView: React.FC<{
   basicTotal: number;
   aiEstimate: AIEstimate | null;
}> = ({ basicTotal, aiEstimate }) => {
   if (!aiEstimate) return null;

   const difference = aiEstimate.price - basicTotal;
   const percentDiff = Math.abs((difference / basicTotal) * 100);

   return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
         <div className="mb-4 flex items-center gap-2">
            <MdTrendingUp className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold">견적 비교</h2>
         </div>

         <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-blue-50 p-3 text-center">
               <p className="text-black-400 mb-1 text-xs">기본 견적</p>
               <p className="text-lg font-bold text-blue-600">
                  {formatPrice(basicTotal)}원
               </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-3 text-center">
               <p className="text-black-400 mb-1 text-xs">AI 견적</p>
               <p className="text-lg font-bold text-purple-600">
                  {formatPrice(aiEstimate.price)}원
               </p>
            </div>
         </div>

         <div
            className={`rounded-lg p-3 text-center ${
               difference > 0
                  ? "bg-red-50 text-red-800"
                  : difference < 0
                    ? "bg-green-50 text-green-800"
                    : "text-black-400 bg-gray-50"
            }`}
         >
            <p className="text-sm font-medium">
               {difference > 0 ? "▲" : difference < 0 ? "▼" : "="}
               {difference !== 0 && ` ${formatPrice(Math.abs(difference))}원`}
               {difference !== 0 && ` (${percentDiff.toFixed(1)}%)`}
            </p>
            <p className="mt-1 text-xs">
               {difference > 0
                  ? "AI 견적이 더 높습니다"
                  : difference < 0
                    ? "AI 견적이 더 낮습니다"
                    : "두 견적이 동일합니다"}
            </p>
         </div>
      </div>
   );
};

// Main Component
export default function Calculator() {
   const [formData, setFormData] = useState<FormData>({
      moveType: "",
      fromAddress: "",
      toAddress: "",
      moveDate: "",
      isWeekend: false,
      hasElevator: true,
      itemAmount: "normal",
      floorLevel: "1-3",
   });

   const [distance, setDistance] = useState<number>(0);
   const [isCalculatingDistance, setIsCalculatingDistance] =
      useState<boolean>(false);
   const [aiEstimate, setAiEstimate] = useState<AIEstimate | null>(null);
   const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

   // Calculate distance when addresses change
   const handleAddressChange = useCallback(
      async (field: "fromAddress" | "toAddress", value: string) => {
         setFormData((prev) => ({ ...prev, [field]: value }));

         if (field === "fromAddress" || field === "toAddress") {
            const updatedFormData = { ...formData, [field]: value };

            if (updatedFormData.fromAddress && updatedFormData.toAddress) {
               setIsCalculatingDistance(true);
               try {
                  const calculatedDistance = await calculateDistance(
                     updatedFormData.fromAddress,
                     updatedFormData.toAddress,
                  );
                  setDistance(calculatedDistance);
               } catch (error) {
                  console.error("거리 계산 실패:", error);
                  setDistance(15); // 기본값
               } finally {
                  setIsCalculatingDistance(false);
               }
            }
         }
      },
      [formData],
   );

   // Handle date change and weekend detection
   const handleDateChange = (date: string) => {
      setFormData((prev) => ({
         ...prev,
         moveDate: date,
         isWeekend: date
            ? new Date(date).getDay() === 0 || new Date(date).getDay() === 6
            : false,
      }));
   };

   // Handle other input changes
   const handleInputChange = (field: keyof FormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   // Generate AI estimate
   const generateAIEstimate = async () => {
      if (!formData.moveType || !distance) return;

      setIsGeneratingAI(true);
      try {
         const estimate = await OpenAIService.generateEstimate(
            formData,
            distance,
         );
         setAiEstimate(estimate);
      } catch (error) {
         console.error("AI 견적 생성 실패:", error);
      } finally {
         setIsGeneratingAI(false);
      }
   };

   // Calculate basic estimate
   const basicEstimate = calculateBasicEstimate(formData, distance);

   // Check if form is complete enough for estimates
   const isFormComplete =
      formData.moveType &&
      formData.fromAddress &&
      formData.toAddress &&
      distance > 0;

   return (
      <div className="min-h-screen bg-gray-50 py-8">
         <div className="mx-auto max-w-6xl px-4">
            {/* Header */}
            <div className="mb-8 text-center">
               <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  <MdCalculate className="mr-2 inline-block h-8 w-8 text-blue-600" />
                  이사 견적 계산기
               </h1>
               <p className="text-black-400">
                  기본 견적과 AI 분석을 통해 정확한 이사 비용을 확인하세요
               </p>
            </div>

            {/* Form Section */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
               {/* Left Column - Input Forms */}
               <div className="space-y-6">
                  <MoveTypeSelector
                     selectedType={formData.moveType}
                     onTypeSelect={(type) =>
                        handleInputChange("moveType", type)
                     }
                  />

                  <AddressInput
                     fromAddress={formData.fromAddress}
                     toAddress={formData.toAddress}
                     distance={distance}
                     isCalculating={isCalculatingDistance}
                     onAddressChange={handleAddressChange}
                  />

                  <AdditionalMdInfoForm
                     formData={formData}
                     onInputChange={handleInputChange}
                     onDateChange={handleDateChange}
                  />
               </div>

               {/* Right Column - Estimates */}
               <div className="space-y-6">
                  {/* Basic Estimate */}
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                     {isFormComplete ? (
                        <BasicEstimateView breakdown={basicEstimate} />
                     ) : (
                        <>
                           <div className="mb-4 flex items-center gap-2">
                              <MdAttachMoney className="h-5 w-5 text-gray-400" />
                              <h2 className="text-lg font-semibold text-gray-500">
                                 기본 견적
                              </h2>
                           </div>
                           <div className="py-8 text-center text-gray-500">
                              <MdCalculate className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                              <p className="text-sm">
                                 이사 유형과 주소를 입력하면
                                 <br />
                                 견적을 확인할 수 있습니다
                              </p>
                           </div>
                        </>
                     )}
                  </div>

                  {/* AI Estimate */}
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                     {isFormComplete ? (
                        <AIEstimateView
                           aiEstimate={aiEstimate}
                           isLoading={isGeneratingAI}
                           onGenerate={generateAIEstimate}
                        />
                     ) : (
                        <>
                           <div className="mb-4 flex items-center gap-2">
                              <MdPsychology className="h-5 w-5 text-gray-400" />
                              <h2 className="text-lg font-semibold text-gray-500">
                                 AI 견적
                              </h2>
                           </div>
                           <div className="py-8 text-center text-gray-500">
                              <MdPsychology className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                              <p className="text-sm">
                                 기본 정보를 입력하면
                                 <br />
                                 AI 견적을 받을 수 있습니다
                              </p>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </div>

            {/* Comparison Section */}
            {isFormComplete && basicEstimate.total > 0 && (
               <ComparisonView
                  basicTotal={basicEstimate.total}
                  aiEstimate={aiEstimate}
               />
            )}

            {/* Footer MdInfo */}
            <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
               <div className="text-left">
                  <div className="mb-4 flex items-center gap-2">
                     <MdInfo className="h-5 w-5 text-blue-600" />
                     <h2 className="text-lg font-semibold">견적 안내</h2>
                  </div>

                  <div className="text-black-400 grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                     <div className="flex items-start gap-2">
                        <MdAttachMoney className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                        <div>
                           <p className="font-medium">기본 견적</p>
                           <p className="text-xs">
                              거리, 이사유형, 날짜 등 기본 요소로 계산
                           </p>
                        </div>
                     </div>
                     <div className="flex items-start gap-2">
                        <MdPsychology className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                        <div>
                           <p className="font-medium">AI 견적</p>
                           <p className="text-xs">
                              시장 동향과 다양한 변수를 AI가 분석
                           </p>
                        </div>
                     </div>
                     <div className="items-MdStart flex gap-2">
                        <MdAccessTime className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
                        <div>
                           <p className="font-medium">참고사항</p>
                           <p className="text-xs">
                              실제 견적은 현장 상황에 따라 달라질 수 있습니다
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
