import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavoriteMover } from "@/lib/api/mover/favoriteMover";
import { FavoriteMoversResponse, FavoriteMoverState } from "@/lib/types";
import { useTranslations } from "next-intl";

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
   const t = useTranslations("FavoriteMovers");
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
               text: t("favoriteToggleSuccess"),
               success: true,
            });
         }
      },
      onError: () => {
         if (onToast) {
            onToast({
               id: Date.now(),
               text: t("favoriteToggleError"),
               success: false,
            });
         }
      },
   });
}
