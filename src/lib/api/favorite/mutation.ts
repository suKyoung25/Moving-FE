import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavoriteMover } from "@/lib/api/mover/favoriteMover";
import { FavoriteMoversResponse, FavoriteMoverState } from "@/lib/types";

interface UseToggleFavoriteMoverParams {
   page: number;
   limit: number;
   onToast?: (toast: { id: number; text: string; success: boolean }) => void;
}

export function useToggleFavoriteMover({
   page,
   limit,
   onToast,
}: UseToggleFavoriteMoverParams) {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: toggleFavoriteMover,
      onSuccess: (res, moverId) => {
         queryClient.setQueryData<FavoriteMoversResponse>(
            ["favoriteMovers", page, limit],
            (oldData) => {
               if (!oldData || !oldData.data?.movers) return oldData;
               return {
                  ...oldData,
                  data: {
                     ...oldData.data,
                     movers: oldData.data.movers.map(
                        (mover: FavoriteMoverState) =>
                           mover.id === moverId
                              ? {
                                   ...mover,
                                   isLiked: res.isFavorite,
                                   favoriteCount: res.favoriteCount,
                                }
                              : mover,
                     ),
                  },
               };
            },
         );
         if (onToast) {
            onToast({
               id: Date.now(),
               text: "찜이 성공적으로 변경되었습니다.",
               success: true,
            });
         }
      },
      onError: () => {
         if (onToast) {
            onToast({
               id: Date.now(),
               text: "찜 처리 중 오류가 발생했습니다.",
               success: false,
            });
         }
      },
   });
}
