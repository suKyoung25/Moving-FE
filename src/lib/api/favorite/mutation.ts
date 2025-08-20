import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FavoriteMoversResponse, FavoriteMoverState } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useToast } from "@/context/ToastContext";
import { toggleFavoriteMover } from "../mover/requests/favoriteMover";

interface UseToggleFavoriteMoverParams {
   page: number;
   limit: number;
}

export function useToggleFavoriteMover({
   page,
   limit,
}: UseToggleFavoriteMoverParams) {
   const t = useTranslations("FavoriteMovers");
   const queryClient = useQueryClient();
   const { showSuccess, showError } = useToast();

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
         showSuccess(t("favoriteToggleSuccess"));
      },
      onError: () => {
         showError(t("favoriteToggleError"));
      },
   });
}
