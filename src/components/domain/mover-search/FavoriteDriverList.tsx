"use client";

import { useState, useEffect, useCallback, memo, useMemo } from "react";
import MoverProfile from "@/components/common/MoverProfile";
import MoveChip, { ChipType } from "@/components/common/MoveChip";
import { getFavoriteMovers } from "@/lib/api/favorite/favorites/getFavoriteMovers";
import { Mover } from "@/lib/types/auth.types";
import { tokenSettings } from "@/lib/utils/auth.util";
import { toggleFavoriteMover } from "@/lib/api/mover/favoriteMover";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastConText"; // 🔥 ToastContext 추가
import { EstimateStatus } from "@/lib/types";

// 🔥 타입 수정: favoriteCount 매개변수 추가
interface FavoriteDriverListProps {
   onFavoriteChange?: (
      moverId: string,
      isFavorite: boolean,
      favoriteCount: number,
   ) => void;
}

// ✅ 함수를 컴포넌트 외부로 이동하여 메모이제이션
function shouldShowDesignatedChip(mover: Mover): boolean {
   return !!(
      mover.hasDesignatedRequest &&
      mover.designatedEstimateStatus !== EstimateStatus.CONFIRMED &&
      mover.designatedEstimateStatus !== EstimateStatus.REJECTED
   );
}

// ✅ 상수를 컴포넌트 외부로 이동
const VALID_CHIP_TYPES: ChipType[] = [
   "SMALL",
   "HOME",
   "OFFICE",
   "DESIGNATED",
   "PENDING",
   "CONFIRMED",
];

// ✅ 메인 컴포넌트를 memo로 최적화
export default memo(function FavoriteDriverList({
   onFavoriteChange,
}: FavoriteDriverListProps) {
   const { user } = useAuth();
   const { showToast } = useToast(); // 🔥 Toast 훅 사용

   const [favoriteMovers, setFavoriteMovers] = useState<Mover[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

   // ✅ 계산값을 메모이제이션
   const isLoggedInAsMover = useMemo(
      () => user?.userType === "mover",
      [user?.userType],
   );

   // ✅ 함수들을 useCallback으로 최적화
   const checkAuthStatus = useCallback(() => {
      return Boolean(tokenSettings.get());
   }, []);

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
            setError("로그인이 필요한 서비스입니다.");
            setIsAuthenticated(false);
         } else {
            setError("찜한 기사님 목록을 불러오는데 실패했습니다.");
         }
      } finally {
         setLoading(false);
      }
   }, [checkAuthStatus, isLoggedInAsMover]);

   // 🔥 수정된 찜하기 로직 - Toast 사용
   const handleFavoriteToggle = useCallback(
      async (moverId: string) => {
         try {
            // 🔥 해제하려는 기사님의 현재 정보 가져오기
            const targetMover = favoriteMovers.find(
               (mover) => mover.id === moverId,
            );
            const newFavoriteCount = Math.max(
               (targetMover?.favoriteCount || 1) - 1,
               0,
            );

            const response = await toggleFavoriteMover(moverId);
            console.log("❤️ FavoriteDriverList 찜 해제:", {
               moverId,
               response,
               newFavoriteCount,
            });

            setFavoriteMovers((prev) =>
               prev.filter((mover) => mover.id !== moverId),
            );

            // 🔥 favoriteCount도 함께 전달
            onFavoriteChange?.(moverId, false, newFavoriteCount);

            // 🎉 Toast로 성공 메시지 표시
            showToast("찜 목록에서 제거되었습니다.", true);

            setTimeout(() => {
               loadFavoriteMovers();
            }, 500);
         } catch (err) {
            console.error("찜 토글 실패:", err);

            // 🚨 에러 메시지를 Toast로 표시
            let errorMessage = "찜 처리 중 오류가 발생했습니다.";
            if (err instanceof Error) {
               if (err.message.includes("로그인")) {
                  errorMessage = "로그인이 필요합니다.";
               } else if (err.message.includes("네트워크")) {
                  errorMessage = "네트워크 연결을 확인해주세요.";
               } else {
                  errorMessage =
                     err.message || "찜 처리 중 오류가 발생했습니다.";
               }
            }

            showToast(errorMessage, false); // 🚨 실패 Toast
         }
      },
      [onFavoriteChange, loadFavoriteMovers, favoriteMovers, showToast], // showToast 의존성 추가
   );

   useEffect(() => {
      loadFavoriteMovers();
   }, [loadFavoriteMovers]);

   // ✅ 표시할 기사 목록을 메모이제이션
   const displayMovers = useMemo(
      () => favoriteMovers.slice(0, 3),
      [favoriteMovers],
   );

   // 🔥 원본 조건부 렌더링 로직 유지
   if (!isAuthenticated || isLoggedInAsMover) {
      return null;
   }

   if (loading) {
      return (
         <div className="mt-8 flex flex-col gap-4 rounded-lg">
            <h2 className="text-18-semibold border-b border-b-gray-100 pb-5">
               찜한 기사님
            </h2>
            <div className="flex items-center justify-center py-8">
               <div className="text-14-medium text-gray-500">로딩 중...</div>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="mt-8 flex flex-col gap-4 rounded-lg">
            <h2 className="text-18-semibold border-b border-b-gray-100 pb-5">
               찜한 기사님
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
               찜한 기사님
            </h2>
            <div className="flex items-center justify-center py-8">
               <div className="text-14-medium text-gray-500">
                  찜한 기사님이 없습니다.
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="mt-8 flex flex-col gap-4 rounded-lg">
         <h2 className="text-18-semibold border-b border-b-gray-100 pb-5">
            찜한 기사님
         </h2>

         {/* 🔥 원본 렌더링 로직 유지 */}
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

                  {/* 🔥 DESIGNATED 칩 로직 유지 */}
                  {shouldShowDesignatedChip(mover) && (
                     <MoveChip type="DESIGNATED" mini={false} />
                  )}
               </div>

               {mover.description && (
                  <p className="text-14-medium line-clamp-2 text-gray-700">
                     {mover.description}
                  </p>
               )}

               {/* 🔥 원본 MoverProfile props 유지 */}
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
