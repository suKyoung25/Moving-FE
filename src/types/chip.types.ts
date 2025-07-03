export const CHIP_TYPES = [
  "SMALL",
  "HOME",
  "OFFICE",
  "DESIGNATED",
  "PENDING",
] as const;
export type ChipType = (typeof CHIP_TYPES)[number];

export function isChipType(value: string): value is ChipType {
  return CHIP_TYPES.includes(value as ChipType);
}
