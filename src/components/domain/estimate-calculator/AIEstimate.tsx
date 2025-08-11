import React from "react";
import { HiSparkles } from "react-icons/hi";
import { AIEstimateType } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import starIcon from "@/assets/images/starFilledIcon.svg";
import { IoRefresh } from "react-icons/io5";
import LineDivider from "@/components/common/LineDivider";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface AIEstimateProps {
   aiQuote: AIEstimateType | null;
   isLoading: boolean;
   onGenerate: () => void;
}

export default function AIEstimate({
   aiQuote,
   isLoading,
   onGenerate,
}: AIEstimateProps) {
   return (
      <>
         <h2 className="text-18-semibold mb-4">AI 견적</h2>

         {!aiQuote ? (
            <div className="rounded-xl bg-gray-50 py-10 text-center">
               <button
                  onClick={onGenerate}
                  disabled={isLoading}
                  className="text-14-medium mx-auto flex items-center gap-2 rounded-lg bg-violet-500 px-6 py-3 text-white hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
               >
                  {isLoading ? (
                     <>
                        <AiOutlineLoading3Quarters className="h-3 w-3 animate-spin" />
                        AI 분석 중...
                     </>
                  ) : (
                     <>
                        <HiSparkles className="h-4 w-4" />
                        AI 견적 받기
                     </>
                  )}
               </button>
               <p className="text-12-regular mt-6 text-gray-500">
                  AI가 시장 동향과 다양한 요소를 분석하여
                  <br className="hidden lg:block" /> 더 정확한 견적을
                  제공합니다.
               </p>
            </div>
         ) : (
            <>
               <div className="bg-primary-blue-500/10 mb-4 rounded-lg p-4">
                  <div className="text-center">
                     <p className="text-black-400 text-14-regular mb-1">
                        AI 예상 비용
                     </p>
                     <p className="text-24-bold text-primary-blue-500">
                        {formatPrice(aiQuote.price)}원
                     </p>
                  </div>
               </div>

               <div className="border-line-200 mb-4 rounded-xl border p-4">
                  <div className="mb-3 flex items-center gap-3">
                     <h3 className="text-14-semibold text-gray-700">
                        AI 분석 결과
                     </h3>
                     <div className="text-12-regular bg-secondary-yellow-100/10 flex items-center gap-0.5 rounded-sm px-1">
                        <Image
                           src={starIcon}
                           alt="starIcon"
                           width={12}
                           height={12}
                        />
                        <span className="text-secondary-yellow-100 text-12-semibold">
                           신뢰도 {aiQuote.confidence}%
                        </span>
                     </div>
                  </div>
                  <p className="text-12-regular text-gray-500">
                     {aiQuote.explanation}
                  </p>
                  <LineDivider className="my-4" />
                  <div className="space-y-2">
                     {aiQuote.factors.map((factor, index) => (
                        <div
                           key={index}
                           className="text-12-regular flex items-center justify-between gap-4"
                        >
                           <span className="text-black-400 break-keep">
                              {factor.factor}
                           </span>
                           <span
                              className={`text-12-regular rounded-lg px-4 py-2 lg:max-w-60 ${
                                 factor.impact.includes("증가") ||
                                 factor.impact.includes("할증")
                                    ? "bg-secondary-red-100 text-secondary-red-200"
                                    : "bg-gray-50 text-gray-700"
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
                  className="text-14-medium flex w-full items-center justify-center gap-2 rounded-lg bg-gray-50 p-4 text-gray-700 hover:bg-gray-100/30"
               >
                  {isLoading ? (
                     <>
                        <AiOutlineLoading3Quarters className="h-3 w-3 animate-spin" />
                        다시 분석 중...
                     </>
                  ) : (
                     <>
                        <IoRefresh className="h-4 w-4" />
                        다시 분석하기
                     </>
                  )}
               </button>
            </>
         )}
      </>
   );
}
