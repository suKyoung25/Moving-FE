import React from "react";
import {
   PriceBreakdown,
   AIEstimateType,
} from "@/lib/types/estimate-calculator.types";
import { formatPrice } from "@/lib/utils/estimate-calculator/price.utils";
import { FaEquals } from "react-icons/fa6";
import { IoCaretDown, IoCaretUp } from "react-icons/io5";
import LineDivider from "@/components/common/LineDivider";

interface EstimateComparisonProps {
   basicEstimate: PriceBreakdown;
   aiEstimate: AIEstimateType | null;
}

export default function EstimateComparison({
   basicEstimate,
   aiEstimate,
}: EstimateComparisonProps) {
   if (!aiEstimate) return null;

   const difference = aiEstimate.price - basicEstimate.total;
   const percentDiff = Math.abs((difference / basicEstimate.total) * 100);

   return (
      <section>
         <LineDivider className="my-8" />
         <h2 className="text-18-semibold mb-4">견적 비교</h2>
         <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-blue-50 p-3 text-center">
               <p className="text-black-400 mb-1 text-xs">기본 견적</p>
               <p className="text-primary-blue-300 text-lg font-bold">
                  {formatPrice(basicEstimate.total)}원
               </p>
            </div>
            <div className="bg-primary-blue-500/10 rounded-lg p-3 text-center">
               <p className="text-black-400 mb-1 text-xs">AI 견적</p>
               <p className="text-primary-blue-500 text-lg font-bold">
                  {formatPrice(aiEstimate.price)}원
               </p>
            </div>
         </div>

         <div
            className={`flex flex-col items-center gap-2 rounded-lg p-3 ${
               difference > 0
                  ? "bg-secondary-red-100 text-secondary-red-200"
                  : difference < 0
                    ? "bg-primary-blue-50 text-primary-blue-300"
                    : "text-black-400 bg-gray-50"
            }`}
         >
            <p className="flex items-center gap-1 text-sm font-medium">
               {difference > 0 ? (
                  <IoCaretUp className="h-4 w-4" />
               ) : difference < 0 ? (
                  <IoCaretDown className="h-4 w-4" />
               ) : (
                  <FaEquals />
               )}
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
      </section>
   );
}
