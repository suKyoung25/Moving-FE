"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import MoverProfile from "@/components/common/MoverProfile";
import MoveChip from "@/components/common/MoveChip";
import Pagination from "@/components/common/pagination";
import EmptyState from "@/components/common/EmptyState";
import SolidButton from "@/components/common/SolidButton";
import { getFavoriteMovers } from "@/lib/api/favorite/getFavoriteMovers";
import { toggleFavoriteMover } from "@/lib/api/mover/favoriteMover";
import { isChipType } from "@/lib/utils/moveChip.util";
import { FavoriteMoversResponse, FavoriteMoverState } from "@/lib/types";
import ToastPopup from "@/components/common/ToastPopup";

export default function FavoriteMover() {
   const t = useTranslations("FavoriteMovers");
   const router = useRouter();

   // 페이지네이션 상태
   const [pagination, setPagination] = useState(() => {
      let initialLimit = 6;
      if (typeof window !== "undefined" && window.innerWidth < 1440)
         initialLimit = 4;
      return {
         page: 1,
         limit: initialLimit,
         totalPages: 1,
      };
   });
   const [toast, setToast] = useState<{
      id: number;
      text: string;
      success: boolean;
   } | null>(null);

   const queryClient = useQueryClient();

   // 찜한 기사님 리스트 패치
   const { data, isPending, error } = useQuery({
      queryKey: ["favoriteMovers", pagination.page, pagination.limit],
      queryFn: () => getFavoriteMovers(pagination.page, pagination.limit),
      placeholderData: (previous) => previous,
      staleTime: 1000 * 60, // 1분
   });

   // 찜 토글 뮤테이션
   const { mutate } = useMutation({
      mutationFn: toggleFavoriteMover,
      onSuccess: (res, moverId) => {
         queryClient.setQueryData<FavoriteMoversResponse>(
            ["favoriteMovers", pagination.page, pagination.limit],
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
         setToast({
            id: Date.now(),
            text: "찜이 성공적으로 변경되었습니다.",
            success: true,
         });
      },
      onError: () => {
         setToast({
            id: Date.now(),
            text: "찜 처리 중 오류가 발생했습니다.",
            success: false,
         });
      },
   });

   const handleLikedClick = (moverId: string) => mutate(moverId);

   const handlePageChange = (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
   };

   const movers: FavoriteMoverState[] = data?.data?.movers ?? [];
   const pageInfo = data?.data?.pagination ?? pagination;

   if (isPending) return <div>로딩 중...</div>;
   if (error) {
      return <div>오류가 발생했습니다.</div>;
   }

   return (
      <>
         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {movers.map((mover) => (
               <div
                  key={mover.id}
                  className="border-line-100 h-37.5 w-full rounded-2xl border bg-white px-3.5 py-4 shadow-[2px_2px_10px_0px_rgba(220,220,220,0.10),_-2px_-2px_10px_0px_rgba(220,220,220,0.10)] md:mb-2 lg:mb-6 lg:h-50.5 lg:px-6 lg:py-5"
               >
                  <div className="mb-3.5 flex gap-2 lg:gap-3">
                     {mover.serviceType.map((type) =>
                        isChipType(type) ? (
                           <MoveChip key={type} type={type} />
                        ) : null,
                     )}
                  </div>
                  <MoverProfile
                     big={true}
                     profileImage={mover.profileImage}
                     isLiked={mover.isLiked}
                     handleLikedClick={() => handleLikedClick(mover.id)}
                     nickName={mover.nickName}
                     favoriteCount={mover.favoriteCount}
                     averageReviewRating={mover.averageReviewRating}
                     reviewCount={mover.reviewCount}
                     career={mover.career!}
                     estimateCount={mover.estimateCount}
                  />
               </div>
            ))}
         </div>
         <Pagination
            page={pageInfo.page}
            totalPages={pageInfo.totalPages}
            onPageChange={handlePageChange}
         />
         {!isPending && movers.length === 0 && (
            <div className="mt-46 flex flex-col items-center justify-center">
               <EmptyState message={t("noFavoriteMover")} />
               <SolidButton
                  className="my-6 max-w-45 lg:my-8"
                  onClick={() => router.replace("/mover-search")}
               >
                  {t("goToFavorite")}
               </SolidButton>
            </div>
         )}
         {toast && (
            <ToastPopup
               key={toast.id}
               text={toast.text}
               success={toast.success}
            />
         )}
      </>
   );
}
