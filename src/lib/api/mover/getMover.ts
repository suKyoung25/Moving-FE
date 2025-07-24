import { tokenFetch, defaultFetch } from "@/lib/utils/fetch-client";
import { Mover } from "@/lib/types/auth.types";
import { GetMoversParams, GetMoversResponse } from "@/lib/types/mover.types";

export const getMovers = async (
  params: GetMoversParams = {},
  withAuth: boolean = false
): Promise<GetMoversResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("page", String(params.page ?? 1));
  queryParams.append("limit", String(params.limit ?? 10));
  if (params.search) queryParams.append("search", params.search);
  if (params.area && params.area !== "all") queryParams.append("area", params.area);
  if (params.serviceType && params.serviceType !== "all")
    queryParams.append("serviceType", params.serviceType);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);

  const endpoint = `/movers?${queryParams.toString()}`;
  
  // 인증이 필요한 경우 tokenFetch, 아닌 경우 defaultFetch 사용
  const data = withAuth 
    ? await tokenFetch(endpoint, { method: 'GET' })
    : await defaultFetch(endpoint, { method: 'GET' });

  const movers = (data.movers || []).map((mover: Mover) => ({
    ...mover,
    favoriteCount: mover.favoriteCount ?? 0,
    region: mover.serviceArea ?? [],
    description: mover.description ?? "고객님의 물품을 안전하게 운송해 드립니다.",
  })) as Mover[];

  return {
    movers,
    hasMore: data.hasMore ?? movers.length === (params.limit ?? 10),
    total: data.total ?? movers.length,
    page: data.page ?? params.page ?? 1,
    limit: data.limit ?? params.limit ?? 10,
  };
};

export const getMoverById = async (
  id: string,
  withAuth: boolean = false
): Promise<Mover> => {
  const endpoint = `/movers/${id}`;
  
  // 인증이 필요한 경우 tokenFetch, 아닌 경우 defaultFetch 사용
  return withAuth 
    ? await tokenFetch(endpoint, { method: 'GET' })
    : await defaultFetch(endpoint, { method: 'GET' });
};