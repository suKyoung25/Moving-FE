import React from "react";
import { PriceBreakdown } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import LineDivider from "@/components/common/LineDivider";

interface BasicEstimateProps {
   breakdown: PriceBreakdown;
}

export default function BasicEstimate({ breakdown }: BasicEstimateProps) {
   return (
      <>
         <h2 className="text-18-semibold mb-4">기본 견적</h2>

         <div className="from-primary-blue-50 to-primary-blue-100 mb-4 rounded-lg bg-gradient-to-r p-4">
            <div className="text-center">
               <p className="text-black-400 text-14-regular mb-1">예상 비용</p>
               <p className="text-primary-blue-300 text-24-bold">
                  {formatPrice(breakdown.total)}원
               </p>
            </div>
         </div>

         <div className="border-line-200 mb-4 rounded-xl border p-4">
            <h3 className="text-14-semibold mb-3 text-gray-700">견적 내역</h3>
            <div className="text-12-regular space-y-2">
               <div className="flex justify-between">
                  <span className="text-black-400">기본료</span>
                  <span>{formatPrice(breakdown.basePrice)}원</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-black-400">거리비용</span>
                  <span>{formatPrice(breakdown.distanceFee)}원</span>
               </div>
               {breakdown.weekendSurcharge > 0 && (
                  <div className="text-primary-blue-500 flex justify-between">
                     <span>주말 할증</span>
                     <span>+{formatPrice(breakdown.weekendSurcharge)}원</span>
                  </div>
               )}
               {breakdown.elevatorAdjustment > 0 && (
                  <div className="text-secondary-red-200 flex justify-between">
                     <span>계단 추가비용</span>
                     <span>+{formatPrice(breakdown.elevatorAdjustment)}원</span>
                  </div>
               )}
               {breakdown.itemAdjustment > 0 && (
                  <div className="text-secondary-red-200 flex justify-between">
                     <span>짐 많은 경우</span>
                     <span>+{formatPrice(breakdown.itemAdjustment)}원</span>
                  </div>
               )}
               {breakdown.itemAdjustment < 0 && (
                  <div className="flex justify-between text-teal-500">
                     <span>짐 적은 경우</span>
                     <span>{formatPrice(breakdown.itemAdjustment)}원</span>
                  </div>
               )}
               {breakdown.floorAdjustment > 0 && (
                  <div className="text-secondary-red-200 flex justify-between">
                     <span>층수 할증</span>
                     <span>+{formatPrice(breakdown.floorAdjustment)}원</span>
                  </div>
               )}
               <LineDivider />
               <div className="flex justify-between">
                  <span className="text-14-semibold">합계</span>
                  <span className="text-14-semibold">
                     {formatPrice(breakdown.total)}원
                  </span>
               </div>
            </div>
         </div>
      </>
   );
}
