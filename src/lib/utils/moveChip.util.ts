import { ChipType } from "@/components/common/MoveChip";

export const isChipType = (value: string): value is ChipType => {
   return ["SMALL", "HOME", "OFFICE", "DESIGNATED", "PENDING", "DONE"].includes(
      value,
   );
};

export const validateServiceTypes = (serviceTypes: string[]): ChipType[] => {
   return serviceTypes.filter(isChipType);
};
