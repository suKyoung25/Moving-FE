//lib/api/mover/getMover.ts
import { tokenFetch, defaultFetch } from "@/lib/utils/fetch-client";
import { Mover } from "@/lib/types/auth.types";
import { GetMoversParams, GetMoversResponse } from "@/lib/types/mover.types";
import { delay } from "../../../../delay";

export const getMovers = async (
   params: GetMoversParams = {},
   withAuth: boolean = false,
   targetLang?: string,
): Promise<GetMoversResponse> => {
   await delay(1000);
   const queryParams = new URLSearchParams();
   queryParams.append("page", String(params.page ?? 1));
   queryParams.append("limit", String(params.limit ?? 10));
   if (params.search) queryParams.append("search", params.search);
   if (params.area && params.area !== "all")
      queryParams.append("area", params.area);
   if (params.serviceType && params.serviceType !== "all")
      queryParams.append("serviceType", params.serviceType);
   if (params.sortBy) queryParams.append("sortBy", params.sortBy);

   // 위치 기반 검색 파라미터 추가
   if (params.latitude !== undefined)
      queryParams.append("latitude", String(params.latitude));
   if (params.longitude !== undefined)
      queryParams.append("longitude", String(params.longitude));
   if (params.radius !== undefined)
      queryParams.append("radius", String(params.radius));

   const endpoint = `/movers?targetLang=${targetLang}&${queryParams.toString()}`;

   // 인증이 필요한 경우 tokenFetch, 아닌 경우 defaultFetch 사용
   const data = withAuth
      ? await tokenFetch(endpoint, { method: "GET" })
      : await defaultFetch(endpoint, { method: "GET" });

   const movers = (data.movers || []).map((mover: Mover) => ({
      ...mover,
      favoriteCount: mover.favoriteCount ?? 0,
      region: mover.serviceArea ?? [],
      description: mover.description ?? " ",
      // 위치 정보 포함
      latitude: mover.latitude,
      longitude: mover.longitude,
      businessAddress: mover.businessAddress,
      distance: mover.distance, // 거리 정보 포함
   })) as Mover[];

   return {
      movers,
      hasMore: data.hasMore ?? movers.length === (params.limit ?? 10),
      total: data.total ?? movers.length,
      page: data.page ?? params.page ?? 1,
      limit: data.limit ?? params.limit ?? 10,
   };
};

// 명시적으로 인증된 상태로만 조회 (찜 상태 필수)
export const getMoverByIdWithAuth = async (
   id: string,
   targetLang?: string,
): Promise<Mover> => {
   await delay(2000);

   const endpoint = `/movers/${id}?targetLang=${targetLang}`;
   return await tokenFetch(endpoint, { method: "GET" });
};

// 명시적으로 비인증 상태로만 조회 (찜 상태 제외)
export const getMoverByIdWithoutAuth = async (
   id: string,
   targetLang?: string,
): Promise<Mover> => {
   await delay(2000);

   const endpoint = `/movers/${id}?targetLang=${targetLang}`;
   return await defaultFetch(endpoint, { method: "GET" });
};
