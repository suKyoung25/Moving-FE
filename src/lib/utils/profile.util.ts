import { serviceTypeMap } from "@/constants";
import { Region } from "../types";

// Region[] > string[] 으로 변환 (regionName만 추출)
// (서비스 지역과 서비스 종류의 데이터 타입을 string[]으로 일치시키기 위함)
export function extractRegionNames(
   serviceArea: Region[] | undefined,
): string[] {
   if (!serviceArea) return [];
   return serviceArea.map((area) => area.regionName);
}

// (역매핑용) 한글 라벨("소형이사") > enum 값("SMALL")
export const labelToEnumMap = Object.fromEntries(
   Object.entries(serviceTypeMap).map(([key, value]) => [value, key]),
);
