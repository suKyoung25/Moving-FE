"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import MoverProfile from "@/components/common/MoverProfile";
import MoveChip from "@/components/common/MoveChip";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/common/EmptyState";
import SolidButton from "@/components/common/SolidButton";
import { isChipType } from "@/lib/utils/moveChip.util";
import { FavoriteMoverState } from "@/lib/types";
import ToastPopup from "@/components/common/ToastPopup";
import { useFavoriteMovers } from "@/lib/api/favorite/query";
import { useToggleFavoriteMover } from "@/lib/api/favorite/mutation";

export default function FavoriteMover() {
   const t = useTranslations("FavoriteMovers");
   const router = useRouter();

   // 페이지네이션 상태
   const [pagination, setPagination] = useState({
      page: 1,
      limit: 6,
      totalPages: 1,
   });
   const [toast, setToast] = useState<{
      id: number;
      text: string;
      success: boolean;
   } | null>(null);

   // 찜한 기사님 리스트 패치
   const { data, isPending, error } = useFavoriteMovers({
      page: pagination.page,
      limit: pagination.limit,
   });

   // 찜 토글 뮤테이션
   const { mutate } = useToggleFavoriteMover({
      page: pagination.page,
      limit: pagination.limit,
      onToast: setToast,
   });

   const handleLikedClick = (e: React.MouseEvent, moverId: string) => {
      e.stopPropagation(); // 이벤트 버블링 방지
      mutate(moverId);
   };

   const handlePageChange = (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
   };

   const handleProfileClick = (moverId: string) => {
      router.push(`/mover-search/${moverId}`); // 기사 상세페이지 경로
   };

   const movers: FavoriteMoverState[] = data?.data?.movers ?? [];
   const pageInfo = data?.data?.pagination ?? pagination;

   if (isPending) return <div>{t("loading")}</div>;
   if (error) {
      return <div>{t("errorOccurred")}</div>;
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
                  <div
                     role="button"
                     tabIndex={0}
                     onClick={() => handleProfileClick(mover.id)}
                     onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                           e.preventDefault();
                           handleProfileClick(mover.id);
                        }
                     }}
                     className="cursor-pointer"
                  >
                     <MoverProfile
                        big={true}
                        profileImage={mover.profileImage}
                        isLiked={mover.isLiked}
                        handleLikedClick={(e) => handleLikedClick(e, mover.id)}
                        nickName={mover.nickName}
                        favoriteCount={mover.favoriteCount}
                        averageReviewRating={mover.averageReviewRating}
                        reviewCount={mover.reviewCount}
                        career={mover.career!}
                        estimateCount={mover.estimateCount}
                     />
                  </div>
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
