import { FormData, PriceBreakdown } from "@/lib/types";
import { calculateEstimate } from "./ai.util";

export const formatPrice = (price: number): string => {
   return price.toLocaleString("ko-KR");
};

export const calculateBasicEstimate = (
   formData: FormData,
   distance: number,
): PriceBreakdown => {
   // calculateEstimate 함수 사용으로 통일
   const estimate = calculateEstimate(formData, distance);

   // 할증/할인 금액 계산
   const baseTotal = estimate.basePrice + estimate.distanceFee;
   const weekendSurcharge = formData.isWeekend ? baseTotal * 0.2 : 0;
   const elevatorAdjustment = formData.hasElevator ? 0 : baseTotal * 0.15;
   const itemAdjustment =
      formData.itemAmount === "many"
         ? baseTotal * 0.3
         : formData.itemAmount === "few"
           ? -baseTotal * 0.2
           : 0;
   const floorAdjustment =
      formData.floorLevel === "4-7"
         ? baseTotal * 0.1
         : formData.floorLevel === "8+"
           ? baseTotal * 0.2
           : 0;

   return {
      basePrice: estimate.basePrice,
      distanceFee: estimate.distanceFee,
      weekendSurcharge: Math.round(weekendSurcharge),
      elevatorAdjustment: Math.round(elevatorAdjustment),
      itemAdjustment: Math.round(itemAdjustment),
      floorAdjustment: Math.round(floorAdjustment),
      total: estimate.estimatedPrice, // calculateEstimate의 결과 사용
   };
};
