import { geocodeAddress } from "@/lib/api/estimate-calculator/requests/geocodeAddress";
import { Coordinates } from "@/lib/types";

// 주소를 좌표로 변환하고 거리 계산
export async function calculateDistance(
   fromAddress: string,
   toAddress: string,
): Promise<{ distance: number; isFallback: boolean }> {
   if (fromAddress === toAddress) {
      return { distance: 0, isFallback: false };
   }

   if (!fromAddress.trim() || !toAddress.trim()) {
      throw new Error("출발지와 도착지를 모두 입력해주세요.");
   }

   try {
      const fromCoords = await geocodeAddress(fromAddress);
      const toCoords = await geocodeAddress(toAddress);

      const distance = calculateHaversineDistance(
         fromCoords.lat,
         fromCoords.lng,
         toCoords.lat,
         toCoords.lng,
      );

      return { distance: Math.round(distance * 10) / 10, isFallback: false };
   } catch {
      return {
         distance: calculateFallbackDistance(fromAddress, toAddress),
         isFallback: true,
      };
   }
}

// Haversine 공식을 사용하여 두 지점 간의 거리 계산 (km)
export function calculateHaversineDistance(
   lat1: number,
   lon1: number,
   lat2: number,
   lon2: number,
): number {
   const R = 6371; // 지구의 반지름 (km)
   const dLat = (lat2 - lat1) * (Math.PI / 180);
   const dLon = (lon2 - lon1) * (Math.PI / 180);
   const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
         Math.cos(lat2 * (Math.PI / 180)) *
         Math.sin(dLon / 2) *
         Math.sin(dLon / 2);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   return R * c;
}

// 두 좌표 간의 직선 거리 계산 (km)
export function calculateDirectDistance(
   fromCoords: Coordinates,
   toCoords: Coordinates,
): number {
   return calculateHaversineDistance(
      fromCoords.lat,
      fromCoords.lng,
      toCoords.lat,
      toCoords.lng,
   );
}

// 주소 기반 대략적인 거리 계산 (fallback)
export function calculateFallbackDistance(
   fromAddress: string,
   toAddress: string,
): number {
   // 간단한 키워드 기반 거리 추정
   const fromRegion = getRegionFromAddress(fromAddress);
   const toRegion = getRegionFromAddress(toAddress);

   if (fromRegion === toRegion) {
      return Math.random() * 5 + 1; // 같은 지역: 1-6km
   }

   if (isAdjacentRegion(fromRegion, toRegion)) {
      return Math.random() * 20 + 10; // 인접 지역: 10-30km
   }

   if (isSameMetropolitan(fromRegion, toRegion)) {
      return Math.random() * 50 + 30; // 같은 광역시: 30-80km
   }

   return Math.random() * 100 + 80; // 다른 지역: 80-180km
}

function getRegionFromAddress(address: string): string {
   if (address.includes("서울")) return "서울";
   if (address.includes("경기")) return "경기";
   if (address.includes("인천")) return "인천";
   if (address.includes("부산")) return "부산";
   if (address.includes("대구")) return "대구";
   if (address.includes("광주")) return "광주";
   if (address.includes("대전")) return "대전";
   if (address.includes("울산")) return "울산";
   if (address.includes("세종")) return "세종";
   if (address.includes("강원")) return "강원";
   if (address.includes("충북")) return "충북";
   if (address.includes("충남")) return "충남";
   if (address.includes("전북")) return "전북";
   if (address.includes("전남")) return "전남";
   if (address.includes("경북")) return "경북";
   if (address.includes("경남")) return "경남";
   if (address.includes("제주")) return "제주";
   return "기타";
}

function isAdjacentRegion(region1: string, region2: string): boolean {
   const adjacentMap: Record<string, string[]> = {
      서울: ["경기", "인천"],
      경기: ["서울", "인천", "강원", "충북", "충남"],
      인천: ["서울", "경기"],
      강원: ["경기", "충북", "경북"],
      충북: ["경기", "강원", "충남", "전북", "경북"],
      충남: ["경기", "충북", "전북", "전남"],
      전북: ["충북", "충남", "전남", "경북"],
      전남: ["충남", "전북", "경북", "경남"],
      경북: ["강원", "충북", "전북", "전남", "경남"],
      경남: ["전남", "경북", "부산", "울산"],
      부산: ["경남", "울산"],
      울산: ["경남", "부산"],
      대구: ["경북"],
      광주: ["전남"],
      대전: ["충남", "충북"],
      세종: ["충남", "충북"],
   };

   return adjacentMap[region1]?.includes(region2) || false;
}

function isSameMetropolitan(region1: string, region2: string): boolean {
   const metropolitanGroups = [
      ["서울", "경기", "인천"],
      ["부산", "경남", "울산"],
      ["대구", "경북"],
      ["광주", "전남"],
      ["대전", "충남", "충북", "세종"],
      ["전북"],
      ["강원"],
      ["제주"],
   ];

   return metropolitanGroups.some(
      (group) => group.includes(region1) && group.includes(region2),
   );
}
