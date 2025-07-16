"use server";

interface KakaoAddressDocument {
   address?: {
      address_name: string;
   };
   road_address?: {
      address_name: string;
      zone_no: string;
   };
}

interface KakaoAddressResponse {
   documents: KakaoAddressDocument[];
}

// 카카오 주소 검색 API를 호출하는 서버 액션
export async function searchAddressAction(query: string) {
   try {
      // Kakao REST API를 호출 (도로명/지번 주소 검색)
      const res = await fetch(
         `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`,
         {
            headers: {
               Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
            },
            cache: "no-store", // 최신 주소 데이터를 받기 위해 캐싱 비활성화
         },
      );

      // 응답 코드가 실패(4xx/5xx)일 경우 예외 처리
      if (!res.ok) {
         const errorBody = await res.text(); // 실패 응답 본문 확인
         throw new Error(
            `카카오 주소 검색 실패 (status: ${res.status})\n${errorBody}`,
         );
      }

      // 응답 본문을 JSON으로 파싱
      const data: KakaoAddressResponse = await res.json();

      // 필요한 정보만 가공해서 반환
      return data.documents.map((doc) => ({
         zonecode: doc.road_address?.zone_no ?? "-", // 우편번호
         roadAddress: doc.road_address?.address_name ?? "-", // 도로명 주소
         jibunAddress: doc.address?.address_name ?? "-", // 지번 주소
      }));
   } catch (error) {
      console.error("searchAddressAction error:", error);
      throw new Error("주소 검색 중 문제가 발생했습니다. 다시 시도해주세요.");
   }
}
