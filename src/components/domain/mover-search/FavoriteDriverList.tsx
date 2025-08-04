"use client";

import { useState, useEffect, useCallback } from "react";
import MoverProfile from "@/components/common/MoverProfile";
import MoveChip, { ChipType } from "@/components/common/MoveChip";
import { getFavoriteMovers } from "@/lib/api/favorite/favorites/getFavoriteMovers";
import { Mover } from "@/lib/types/auth.types";
import { tokenSettings } from "@/lib/utils/auth.util";
import { toggleFavoriteMover } from "@/lib/api/mover/favoriteMover";
import { useAuth } from "@/context/AuthContext";
import { EstimateStatus } from "@/lib/types";

interface FavoriteDriverListProps {
   onFavoriteChange?: (moverId: string, isFavorite: boolean) => void;
}

export default function FavoriteDriverList({
   onFavoriteChange,
}: FavoriteDriverListProps) {
   const { user } = useAuth();
   const [favoriteMovers, setFavoriteMovers] = useState<Mover[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

   const isLoggedInAsMover = user?.userType === "mover";

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

   const handleFavoriteToggle = useCallback(
      async (moverId: string) => {
         try {
            const response = await toggleFavoriteMover(moverId);
            console.log("❤️ FavoriteDriverList 찜 해제:", {
               moverId,
               response,
            });

            setFavoriteMovers((prev) =>
               prev.filter((mover) => mover.id !== moverId),
            );

            onFavoriteChange?.(moverId, false);

            setTimeout(() => {
               loadFavoriteMovers();
            }, 500);
         } catch (err) {
            console.error("찜 토글 실패:", err);
            alert("찜 처리 중 오류가 발생했습니다.");
         }
      },
      [onFavoriteChange, loadFavoriteMovers],
   );

   useEffect(() => {
      loadFavoriteMovers();
   }, [loadFavoriteMovers]);

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

   const displayMovers = favoriteMovers.slice(0, 3);

   function shouldShowDesignatedChip(mover: Mover): boolean {
      // 지정견적 요청이 있고, 아직 처리되지 않은 경우 (CONFIRMED나 REJECTED가 아닌 경우)
      return !!(
         mover.hasDesignatedRequest &&
         mover.designatedEstimateStatus !== EstimateStatus.CONFIRMED &&
         mover.designatedEstimateStatus !== EstimateStatus.REJECTED
      );
   }

   return (
      <div className="mt-8 flex flex-col gap-4 rounded-lg">
         <h2 className="text-18-semibold border-b border-b-gray-100 pb-5">
            찜한 기사님
         </h2>

         {displayMovers.map((mover) => (
            <div
               key={mover.id}
               className="flex flex-col gap-2 rounded-lg border border-gray-50 bg-white p-3 shadow-sm"
            >
               <div className="flex gap-1">
                  {mover.serviceType?.map((type: string, index: number) => {
                     const chipType = type.toUpperCase() as ChipType;
                     const validChipTypes: ChipType[] = [
                        "SMALL",
                        "HOME",
                        "OFFICE",
                        "DESIGNATED",
                        "PENDING",
                        "CONFIRMED",
                     ];

                     if (validChipTypes.includes(chipType)) {
                        return (
                           <MoveChip key={index} type={chipType} mini={false} />
                        );
                     }
                     return null;
                  })}

                  {/* 🔥 DESIGNATED 칩 추가 */}
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
}
