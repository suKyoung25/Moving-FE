import { FormData, PriceBreakdown } from "@/lib/types";

export const formatPrice = (price: number): string => {
   return price.toLocaleString("ko-KR");
};

export const calculateBasicEstimate = (
   formData: FormData,
   distance: number,
): PriceBreakdown => {
   // 기본 요금
   const basePrices = { SMALL: 40000, HOME: 80000, OFFICE: 100000 };
   const basePrice = basePrices[formData.moveType as keyof typeof basePrices];

   // 거리 비용 (1km당 1,000원)
   const distanceFee = Math.max(distance, 1) * 1000;

   // 주말 할증 (20%)
   const weekendSurcharge = formData.isWeekend
      ? (basePrice + distanceFee) * 0.2
      : 0;

   // 엘리베이터 조정 (계단 이용 시 15% 추가)
   const elevatorAdjustment = formData.hasElevator
      ? 0
      : (basePrice + distanceFee) * 0.15;

   // 짐의 양 조정
   let itemAdjustment = 0;
   if (formData.itemAmount === "many") {
      itemAdjustment = (basePrice + distanceFee) * 0.3; // 많은 짐 +30%
   } else if (formData.itemAmount === "few") {
      itemAdjustment = -(basePrice + distanceFee) * 0.2; // 적은 짐 -20%
   }

   // 층수 조정
   let floorAdjustment = 0;
   if (formData.floorLevel === "4-7") {
      floorAdjustment = (basePrice + distanceFee) * 0.1; // 4-7층 +10%
   } else if (formData.floorLevel === "8+") {
      floorAdjustment = (basePrice + distanceFee) * 0.2; // 8층 이상 +20%
   }

   const total =
      basePrice +
      distanceFee +
      weekendSurcharge +
      elevatorAdjustment +
      itemAdjustment +
      floorAdjustment;

   return {
      basePrice,
      distanceFee,
      weekendSurcharge: Math.round(weekendSurcharge),
      elevatorAdjustment: Math.round(elevatorAdjustment),
      itemAdjustment: Math.round(itemAdjustment),
      floorAdjustment: Math.round(floorAdjustment),
      total: Math.round(total),
   };
};
