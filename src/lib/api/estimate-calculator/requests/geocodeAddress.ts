import { Coordinates, AddressSuggestion } from "@/lib/types";

// Google Maps Geocoding API를 사용하여 주소를 좌표로 변환
export async function geocodeAddress(address: string): Promise<Coordinates> {
   try {
      const response = await fetch(
         `/api/google-maps/geocode?address=${encodeURIComponent(address)}`,
      );

      if (!response.ok) {
         throw new Error(`Geocoding API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "OK") {
         if (data.status === "REQUEST_DENIED") {
            throw new Error("API 키 인증 실패 또는 권한 없음");
         } else if (data.status === "OVER_QUERY_LIMIT") {
            throw new Error("API 할당량 초과");
         } else if (data.status === "ZERO_RESULTS") {
            throw new Error(`주소를 찾을 수 없습니다: ${address}`);
         } else {
            throw new Error(`Geocoding failed: ${data.status}`);
         }
      }

      if (!data.results || data.results.length === 0) {
         throw new Error(`주소를 찾을 수 없습니다: ${address}`);
      }

      const location = data.results[0].geometry.location;
      return {
         lat: location.lat,
         lng: location.lng,
      };
   } catch (error) {
      throw error;
   }
}

// Google Maps Places API를 사용하여 주소 자동완성
export async function getAddressSuggestions(
   input: string,
): Promise<AddressSuggestion[]> {
   try {
      if (input.length < 2 || input.length > 50) {
         return [];
      }

      const response = await fetch(
         `/api/google-maps/places?input=${encodeURIComponent(input)}`,
      );

      if (!response.ok) {
         return [];
      }

      const data = await response.json();

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
         return [];
      }

      if (!data.predictions || data.predictions.length === 0) {
         return [];
      }

      // API에서 받은 데이터를 AddressSuggestion 타입으로 변환
      const suggestions = data.predictions.map(
         (prediction: { description: string; place_id?: string }) => ({
            description: prediction.description,
            place_id: prediction.place_id,
         }),
      );

      // 한국 주소를 우선으로 정렬
      return suggestions.sort((a: AddressSuggestion, b: AddressSuggestion) => {
         const aIsKorean =
            a.description.includes("서울") ||
            a.description.includes("경기") ||
            a.description.includes("인천");
         const bIsKorean =
            b.description.includes("서울") || b.description.includes("인천");
         if (aIsKorean && !bIsKorean) return -1;
         if (!aIsKorean && bIsKorean) return 1;
         return 0;
      });
   } catch {
      return [];
   }
}

// 주소 유효성 검증
export async function validateAddress(address: string): Promise<boolean> {
   try {
      await geocodeAddress(address);
      return true;
   } catch {
      return false;
   }
}
