export const moveTypeOptions = [
   {
      moveType: "SMALL" as const,
      label: "소형 이사",
      desc: "짐이 적고 간단한 이사",
      price: "4만원~",
   },
   {
      moveType: "HOME" as const,
      label: "가정집 이사",
      desc: "일반적인 가정집 이사",
      price: "8만원~",
   },
   {
      moveType: "OFFICE" as const,
      label: "사무실 이사",
      desc: "사무실, 상가 이사",
      price: "10만원~",
   },
];

export const moveTypeLabels = {
   SMALL: "소형 이사",
   HOME: "가정집 이사",
   OFFICE: "사무실 이사",
};

export const itemAmountLabels = {
   few: "적음",
   normal: "보통",
   many: "많음",
};

export const floorLevelLabels = {
   "1-3": "1-3층",
   "4-7": "4-7층",
   "8+": "8층 이상",
};

export function getMoveTypeLabel(moveType: string): string {
   const option = moveTypeOptions.find((opt) => opt.moveType === moveType);
   return option?.label || moveType;
}

export function getItemAmountLabel(itemAmount: string): string {
   return (
      itemAmountLabels[itemAmount as keyof typeof itemAmountLabels] ||
      itemAmount
   );
}

export function getFloorLevelLabel(floorLevel: string): string {
   return (
      floorLevelLabels[floorLevel as keyof typeof floorLevelLabels] ||
      floorLevel
   );
}
