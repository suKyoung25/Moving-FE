import { ChipType } from "@/components/common/MoveChip";

export const isChipType = (value: string): value is ChipType => {
   return [
      "SMALL",
      "HOME",
      "OFFICE",
      "DESIGNATED",
      "MATCHING_SUCCESS",
      "MATCHING_FAILED",
      "PENDING",
      "CONFIRMED",
      "DONE",
   ].includes(value);
};

export const validateServiceTypes = (serviceTypes: string[]): ChipType[] => {
   return serviceTypes.filter(isChipType);
};
