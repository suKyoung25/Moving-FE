"use client";

import { useState, useEffect, useCallback, memo, useMemo } from "react";
import MoverProfile from "@/components/common/MoverProfile";
import MoveChip, { ChipType } from "@/components/common/MoveChip";
import { getFavoriteMovers } from "@/lib/api/favorite/favorites/getFavoriteMovers";
import { tokenSettings } from "@/lib/utils/auth.util";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastConText";
import { EstimateStatus, Mover } from "@/lib/types";
import { useTranslations } from "next-intl";

// 타입 수정: favoriteCount 매개변수 추가
interface FavoriteDriverListProps {
   onFavoriteChange?: (
      moverId: string,
      isFavorite: boolean,
      favoriteCount: number,
   ) => void;
}

// 함수를 컴포넌트 외부로 이동하여 메모이제이션
function shouldShowDesignatedChip(mover: Mover): boolean {
   return !!(
      mover.hasDesignatedRequest &&
      mover.designatedEstimateStatus !== EstimateStatus.CONFIRMED &&
      mover.designatedEstimateStatus !== EstimateStatus.REJECTED
   );
}

// 상수를 컴포넌트 외부로 이동
const VALID_CHIP_TYPES: ChipType[] = [
   "SMALL",
   "HOME",
   "OFFICE",
   "DESIGNATED",
   "PENDING",
   "CONFIRMED",
];

// 메인 컴포넌트를 memo로 최적화
export default memo(function FavoriteDriverList({
   onFavoriteChange,
}: FavoriteDriverListProps) {
   const t = useTranslations("FavoriteMovers");

   const { user } = useAuth();
   const { showSuccess, showError } = useToast();

   const [favoriteMovers, setFavoriteMovers] = useState<Mover[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

   // 계산값을 메모이제이션
   const isLoggedInAsMover = useMemo(
      () => user?.userType === "mover",
      [user?.userType],
   );

   // 함수들을 useCallback으로 최적화
   const checkAuthStatus = useCallback(() => {
      return Boolean(tokenSettings.get());
   }, []);

   // t 의존성 추가
   const loadFavoriteMovers = useCallback(async () => {
      const authStatus = checkAuthStatus();
      setIsAuthenticated(authStatus);

      if (!authStatus || isLoggedInAsMover) {
         setFavoriteMovers([]);
         return;
      }

      try {
         setLoading(true);
         setError(null);

         const response = await getFavoriteMovers(1, 10);

         if (response?.data?.movers) {
            const moversWithFavoriteTrue = response.data.movers.map(
               (mover: Mover) => ({
                  ...mover,
                  isFavorite: true,
               }),
            );
            setFavoriteMovers(moversWithFavoriteTrue);
         }
      } catch (err) {
         console.error("찜한 기사님 목록 로드 실패:", err);

         if (err instanceof Error && err.message.includes("로그인")) {
            setError(t("loginRequired"));
            setIsAuthenticated(false);
         } else {
            setError(t("loadFailed"));
         }
      } finally {
         setLoading(false);
      }
   }, [checkAuthStatus, isLoggedInAsMover, t]);

   // 수정된 찜하기 로직 - Toast 사용 + t 의존성 추가
   const handleFavoriteToggle = useCallback(
      async (moverId: string) => {
         try {
            // 해제하려는 기사님의 현재 정보 가져오기
            const targetMover = favoriteMovers.find(
               (mover) => mover.id === moverId,
            );
            const newFavoriteCount = Math.max(
               (targetMover?.favoriteCount || 1) - 1,
               0,
            );

            setFavoriteMovers((prev) =>
               prev.filter((mover) => mover.id !== moverId),
            );

            // favoriteCount도 함께 전달
            onFavoriteChange?.(moverId, false, newFavoriteCount);

            // Toast로 성공 메시지 표시
            showSuccess("찜 목록에서 제거되었습니다.");

            setTimeout(() => {
               loadFavoriteMovers();
            }, 500);
         } catch (err) {
            console.error("찜 토글 실패:", err);
            showError(t("toggleError"));
         }
      },
      [onFavoriteChange, loadFavoriteMovers, favoriteMovers, showError, t],
   );

   useEffect(() => {
      loadFavoriteMovers();
   }, [loadFavoriteMovers]);

   // 표시할 기사 목록을 메모이제이션
   const displayMovers = useMemo(
      () => favoriteMovers.slice(0, 3),
      [favoriteMovers],
   );

   // 조건부 렌더링
   if (!isAuthenticated || isLoggedInAsMover) {
      return null;
   }

   if (loading) {
      return (
         <div className="mt-8 flex flex-col gap-4 rounded-lg">
            <h2 className="text-18-semibold border-b border-b-gray-100 pb-5">
               {t("title")}
            </h2>
            <div className="flex items-center justify-center py-8">
               <div className="text-14-medium text-gray-500">
                  {t("loading")}
               </div>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="mt-8 flex flex-col gap-4 rounded-lg">
            <h2 className="text-18-semibold border-b border-b-gray-100 pb-5">
               {t("title")}
            </h2>
            <div className="flex items-center justify-center py-8">
               <div className="text-14-medium text-red-500">{error}</div>
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
               <div className="text-14-medium text-gray-500">
                  {t("noFavorites")}
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="mt-8 flex flex-col gap-4 rounded-lg">
         <h2 className="text-18-semibold border-b border-b-gray-100 pb-5">
            {t("title")}
         </h2>

         {displayMovers.map((mover) => (
            <div
               key={mover.id}
               className="flex flex-col gap-2 rounded-lg border border-gray-50 bg-white p-3 shadow-sm"
            >
               <div className="flex gap-1">
                  {mover.serviceType?.map((type: string, index: number) => {
                     const chipType = type.toUpperCase() as ChipType;

                     if (VALID_CHIP_TYPES.includes(chipType)) {
                        return (
                           <MoveChip key={index} type={chipType} mini={false} />
                        );
                     }
                     return null;
                  })}

                  {/* DESIGNATED 칩 로직 */}
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
                  handleLikedClick={() => handleFavoriteToggle(mover.id)}
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
   );
});
