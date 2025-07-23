// getMover.api.ts
import { Mover } from "@/lib/types";
import { GetMoversParams, GetMoversResponse } from "@/lib/types/mover.types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/movers`
  : "http://localhost:4000/movers";

export const getMovers = async (
  params: GetMoversParams = {},
  token?: string
): Promise<GetMoversResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("page", String(params.page ?? 1));
  queryParams.append("limit", String(params.limit ?? 10));
  if (params.search) queryParams.append("search", params.search);
  if (params.area && params.area !== "all") queryParams.append("area", params.area);
  if (params.serviceType && params.serviceType !== "all")
    queryParams.append("serviceType", params.serviceType);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);

  const res = await fetch(`${API_BASE}?${queryParams.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) throw new Error("Failed to fetch movers");

  const data = await res.json();
  const movers = (data.movers || []).map((mover: any) => ({
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
  token?: string
): Promise<Mover> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) throw new Error("기사 상세 조회 실패");

  return res.json();
};
