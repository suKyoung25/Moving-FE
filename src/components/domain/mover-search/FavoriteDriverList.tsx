"use client";

import {
   useCallback,
   memo,
   useMemo,
   useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MoverProfile from "@/components/common/MoverProfile";
import MoveChip, { ChipType } from "@/components/common/MoveChip";
import { getFavoriteMovers } from "@/lib/api/favorite/favorites/getFavoriteMovers";
import { toggleFavoriteMover } from "@/lib/api/mover/favoriteMover";
import { Mover } from "@/lib/types/auth.types";
import { tokenSettings } from "@/lib/utils/auth.util";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastConText";
import { EstimateStatus } from "@/lib/types";
import { useTranslations } from "next-intl";

interface FavoriteDriverListProps {
   onFavoriteChange?: (
      moverId: string,
      isFavorite: boolean,
      favoriteCount: number,
   ) => void;
   refreshKey?: number;
}

// 컴포넌트 외부로 이동
function shouldShowDesignatedChip(mover: Mover): boolean {
   return !!(
      mover.hasDesignatedRequest &&
      mover.designatedEstimateStatus !== EstimateStatus.CONFIRMED &&
      mover.designatedEstimateStatus !== EstimateStatus.REJECTED
   );
}

const VALID_CHIP_TYPES: ChipType[] = [
   "SMALL", "HOME", "OFFICE", "DESIGNATED", "PENDING", "CONFIRMED",
];

// ✅ 스켈레톤 컴포넌트 추가
const FavoriteItemSkeleton = memo(function FavoriteItemSkeleton() {
   return (
      <div className="animate-pulse rounded-lg border border-gray-100 bg-white p-3">
         <div className="mb-3 space-y-2">
            <div className="h-4 w-full rounded bg-gray-200"></div>
         </div>
         <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
               <div className="h-4 w-1/2 rounded bg-gray-200"></div>
               <div className="flex gap-4">
                  <div className="h-3 w-12 rounded bg-gray-200"></div>
               </div>
            </div>
            <div className="h-6 w-6 rounded bg-gray-200"></div>
         </div>
      </div>
   );
});

const FavoriteLoadingSkeleton = memo(function FavoriteLoadingSkeleton() {
   return (
      <div className="mt-8 flex flex-col gap-4 rounded-lg">
         <div className="border-b border-b-gray-100 pb-5">
            <div className="h-6 w-32 rounded bg-gray-200"></div>
         </div>
         <div className="space-y-4">
            <FavoriteItemSkeleton />
            <FavoriteItemSkeleton />
            <FavoriteItemSkeleton />
         </div>
      </div>
   );
});

export default memo(function FavoriteDriverList({
   onFavoriteChange,
   refreshKey = 0,
}: FavoriteDriverListProps) {
   const t = useTranslations("FavoriteMovers");
   const router = useRouter();
   const queryClient = useQueryClient();
   const { user } = useAuth();
   const { showSuccess, showError } = useToast();
   const [isPending, startTransition] = useTransition();

   // ✅ 최대한 간단한 인증 상태 체크
   const shouldFetch = useMemo(() => {
      const hasToken = Boolean(tokenSettings.get());
      const isClient = user?.userType !== "mover";
      return hasToken && isClient;
   }, [user?.userType]);

   // ✅ 극도로 간소화된 쿼리 설정
   const {
      data: favoriteMovers = [],
      isLoading,
      isError,
      error,
   } = useQuery({
      queryKey: ['favorite-movers', refreshKey],
      queryFn: async () => {
         const response = await getFavoriteMovers(1, 10);
         return response?.data?.movers?.map((mover: Mover) => ({
            ...mover,
            isFavorite: true,
         })) || [];
      },
      enabled: shouldFetch,
      staleTime: 10 * 60 * 1000, // 10분 - 길게 설정
      retry: false, // 재시도 완전 비활성화
      refetchOnWindowFocus: false, // 포커스 시 재요청 비활성화
      refetchOnMount: false, // 마운트 시 재요청 비활성화
   });

   // ✅ 극도로 간소화된 뮤테이션
   const toggleFavoriteMutation = useMutation({
      mutationFn: (moverId: string) => toggleFavoriteMover(moverId),
      onSuccess: (result, moverId) => {
         // ✅ 쿼리 데이터 직접 업데이트 (invalidate 사용 안함)
         queryClient.setQueryData(['favorite-movers', refreshKey], (old: Mover[] = []) => 
            old.filter(mover => mover.id !== moverId)
         );
         
         onFavoriteChange?.(moverId, false, result.favoriteCount || 0);
         showSuccess(t("removeSuccess"));
      },
      onError: (error: Error) => {
         console.error("찜 토글 실패:", error);
         showError(t("toggleError"));
      },
   });

   const handleFavoriteToggle = useCallback((e: React.MouseEvent, moverId: string) => {
      e.stopPropagation();
      toggleFavoriteMutation.mutate(moverId);
   }, [toggleFavoriteMutation]);

   const handleCardClick = useCallback((moverId: string) => {
      startTransition(() => {
         router.push(`/mover-search/${moverId}`);
      });
   }, [router]);

   // ✅ 조건부 렌더링
   if (!shouldFetch) return null;

   // ✅ 로딩 상태 - 스켈레톤 사용
   if (isLoading) {
      return <FavoriteLoadingSkeleton />;
   }

   if (isError) {
      return (
         <div className="mt-8 flex flex-col gap-4 rounded-lg">
            <h2 className="text-18-semibold border-b border-b-gray-100 pb-5">
               {t("title")}
            </h2>
            <div className="flex flex-col items-center justify-center gap-3 py-8">
               <div className="text-14-medium text-red-500">
                  {error instanceof Error && error.message.includes("로그인") 
                     ? t("loginRequired") 
                     : t("loadFailed")}
               </div>
            </div>
         </div>
      );
   }

   if (favoriteMovers.length === 0) {
      return (
         <div className="mt-8 flex flex-col gap-4 rounded-lg">
            <h2 className="text-18-semibold border-b border-b-gray-100 pb-5">
               {t("title")}
            </h2>
            <div className="flex items-center justify-center py-8">
               <div className="text-14-medium text-gray-500">{t("noFavorites")}</div>
            </div>
         </div>
      );
   }

   const displayMovers = favoriteMovers.slice(0, 3);

   return (
      <div className="mt-8 flex flex-col gap-4 rounded-lg">
         <div className="flex items-center justify-between border-b border-b-gray-100 pb-5">
            <h2 className="text-18-semibold">{t("title")}</h2>
         </div>

         <div className="space-y-4">
            {displayMovers.map((mover: Mover) => (
               <div
                  key={mover.id}
                  onClick={() => handleCardClick(mover.id)}
                  className={`relative flex cursor-pointer flex-col gap-2 rounded-lg border border-gray-100 bg-white p-3 transition-opacity hover:shadow-sm ${
                     isPending ? "opacity-75" : ""
                  }`}
               >
                  {toggleFavoriteMutation.isPending && (
                     <div className="absolute top-2 right-2 z-10">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                     </div>
                  )}

                  <div className="flex gap-1">
                     {mover.serviceType?.map((type: string, index: number) => {
                        const chipType = type.toUpperCase() as ChipType;
                        if (VALID_CHIP_TYPES.includes(chipType)) {
                           return <MoveChip key={index} type={chipType} mini={false} />;
                        }
                        return null;
                     })}

                     {shouldShowDesignatedChip(mover) && (
                        <MoveChip type="DESIGNATED" mini={false} />
                     )}
                  </div>

                  {mover.description && (
                     <p className="text-14-medium line-clamp-2 text-gray-700">
                        {mover.description}
                     </p>
                  )}

                  <MoverProfile
                     profileImage={mover.profileImage}
                     forceMobileStyle={true}
                     big={false}
                     isLiked={true}
                     handleLikedClick={(e) => handleFavoriteToggle(e, mover.id)}
                     nickName={mover.nickName || " "}
                     favoriteCount={mover.favoriteCount || 0}
                     averageReviewRating={mover.averageReviewRating || 0}
                     reviewCount={mover.reviewCount || 0}
                     career={Number(mover.career) || 0}
                     estimateCount={mover.estimateCount || 0}
                     showHeart={true}
                  />
               </div>
            ))}
         </div>
      </div>
   );
});