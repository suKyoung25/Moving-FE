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

export async function searchAddressAction(query: string) {
  const res = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
      cache: "no-store", // 최신 결과 패칭
    }
  );

  if (!res.ok) {
    throw new Error("카카오 주소 검색 실패");
  }

  const data: KakaoAddressResponse = await res.json();

  return data.documents.map((doc) => ({
    zonecode: doc.road_address?.zone_no ?? "-",
    roadAddress: doc.road_address?.address_name ?? "-",
    jibunAddress: doc.address?.address_name ?? "-",
  }));
}
