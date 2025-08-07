"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import MoverProfile from "@/components/common/MoverProfile";
import MoveChip from "@/components/common/MoveChip";
import type { Mover } from "@/lib/types";
import { validateServiceTypes } from "@/lib/utils/moveChip.util";
import { toggleFavoriteMover } from "@/lib/api/mover/favoriteMover";
import { useAuth } from "@/context/AuthContext";
import { EstimateStatus } from "@/lib/types";
import { useTranslations } from "next-intl";

interface DriverCardProps {
   mover: Mover;
   onFavoriteChange?: (
      moverId: string,
      isFavorite: boolean,
      favoriteCount: number,
   ) => void;
}
function shouldShowDesignatedChip(mover: Mover): boolean {
   // 지정견적 요청이 있고, 아직 처리되지 않은 경우 (CONFIRMED나 REJECTED가 아닌 경우)
   return !!(
      mover.hasDesignatedRequest &&
      mover.designatedEstimateStatus !== EstimateStatus.CONFIRMED &&
      mover.designatedEstimateStatus !== EstimateStatus.REJECTED
   );
}

export default function DriverCard({
   mover,
   onFavoriteChange,
}: DriverCardProps) {
   const t = useTranslations("MoverSearch");

   const router = useRouter();
   const pathname = usePathname();
   const { user } = useAuth();

   const isLoggedInAsMover = user?.userType === "mover";
   const isFavoritePage = pathname.includes("favorite-movers");

   const [currentFavoriteState, setCurrentFavoriteState] = useState(
      isFavoritePage ? true : (mover.isFavorite ?? false),
   );

   useEffect(() => {
      if (!isFavoritePage) {
         setCurrentFavoriteState(mover.isFavorite ?? false);
      }
   }, [mover.isFavorite, isFavoritePage]);

   const handleCardClick = () => {
      router.push(`/mover-search/${mover.id}`);
   };

   const handleLikedClick = async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isLoggedInAsMover) {
         alert(t("error.loggedInAsMover"));
         return;
      }

      if (!user) {
         alert(t("error.needLogin"));
         return;
      }

      try {
         const result = await toggleFavoriteMover(mover.id);

         setCurrentFavoriteState(result.isFavorite);

         onFavoriteChange?.(
            mover.id,
            result.isFavorite,
            result.favoriteCount || mover.favoriteCount,
         );

         const message =
            result.action === "added"
               ? "찜 목록에 추가되었습니다."
               : "찜 목록에서 제거되었습니다.";
         console.log(message);
      } catch (error) {
         console.error("찜 처리 중 오류:", error);

         let errorMessage = t("error.toggleFailed");
         if (error instanceof Error) {
            if (error.message.includes("로그인")) {
               errorMessage = t("error.needLogin");
            } else {
               errorMessage = error.message;
            }
         }

         alert(errorMessage);
      }
   };

   const validServiceTypes = validateServiceTypes(mover.serviceType!);

   return (
      <div
         onClick={handleCardClick}
         className="flex h-48 w-full cursor-pointer items-center justify-center rounded-xl border border-gray-50 bg-white shadow-sm transition hover:shadow-md lg:h-56 lg:px-5"
      >
         <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
               {/* 기존 서비스 타입 칩들 */}
               {validServiceTypes.map((type) => (
                  <MoveChip key={type} type={type} mini={false} />
               ))}

               {/* DESIGNATED 칩: 지정견적 요청 있고 아직 미처리 */}
               {shouldShowDesignatedChip(mover) && (
                  <MoveChip type="DESIGNATED" mini={false} />
               )}
            </div>

            {/* 소개글 */}
            <div className="mb-4">
               <p className="text-14-medium md:text-16-medium lg:text-18-medium line-clamp-2 leading-relaxed break-words text-gray-700">
                  {mover.introduction || t("defaultIntroduction")}
               </p>
            </div>

            <div className="box-border h-20 w-72 md:w-[34rem] lg:h-24 lg:w-[56rem]">
               <MoverProfile
                  big={false}
                  isLiked={currentFavoriteState}
                  handleLikedClick={handleLikedClick}
                  nickName={mover.nickName ?? " "}
                  favoriteCount={mover.favoriteCount}
                  averageReviewRating={mover.averageReviewRating}
                  reviewCount={mover.reviewCount}
                  career={Number(mover.career) || 0}
                  estimateCount={mover.estimateCount}
                  profileImage={mover.profileImage}
                  showHeart={!isLoggedInAsMover}
               />
            </div>
         </div>
      </div>
   );
}
