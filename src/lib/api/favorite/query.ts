import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FavoriteMoversResponse } from "@/lib/types";
import { getFavoriteMovers } from "./favorites/getFavoriteMovers";

interface UseFavoriteMoversParams {
   page: number;
   limit: number;
}

export function useFavoriteMovers({ page, limit }: UseFavoriteMoversParams) {
   return useQuery<FavoriteMoversResponse>({
      queryKey: ["favoriteMovers", page, limit],
      queryFn: () => getFavoriteMovers(page, limit),
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
   });
}
