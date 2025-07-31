import { Mover, EstimateStatus } from "@/lib/types";

// 🔥 DESIGNATED 칩 표시 여부 결정 함수
export const shouldShowDesignatedChip = (mover: Mover): boolean => {
   // 지정견적 요청이 있고, 아직 견적서가 처리되지 않았으면 칩 표시
   return !!(mover.hasDesignatedRequest && !mover.designatedEstimateStatus);
};
