"use client";

import { useRouter, usePathname } from "next/navigation";
import {
   useState,
   useEffect,
   useCallback,
   useMemo,
   memo,
   useTransition,
} from "react";
import MoverProfile from "@/components/common/MoverProfile";
import MoveChip from "@/components/common/MoveChip";
import type { Mover } from "@/lib/types";
import { validateServiceTypes } from "@/lib/utils/moveChip.util";
import { toggleFavoriteMover } from "@/lib/api/mover/favoriteMover";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastConText";
import { EstimateStatus } from "@/lib/types";

interface DriverCardProps {
   mover: Mover;
   onFavoriteChange?: (
      moverId: string,
      isFavorite: boolean,
      favoriteCount: number,
   ) => void;
}

export default memo(function DriverCard({
   mover,
   onFavoriteChange,
}: DriverCardProps) {
   const router = useRouter();
   const pathname = usePathname();
   const { user } = useAuth();
   const { showToast } = useToast();

   const [isPending, startTransition] = useTransition();

   // 계산값들을 메모이제이션
   const isLoggedInAsMover = useMemo(
      () => user?.userType === "mover",
      [user?.userType],
   );

   const isFavoritePage = useMemo(
      () => pathname.includes("favorite-movers"),
      [pathname],
   );

   const validServiceTypes = useMemo(
      () => validateServiceTypes(mover.serviceType!),
      [mover.serviceType],
   );

   const shouldShowDesignated = useMemo(() => {
      return !!(
         mover.hasDesignatedRequest &&
         mover.designatedEstimateStatus !== EstimateStatus.CONFIRMED &&
         mover.designatedEstimateStatus !== EstimateStatus.REJECTED
      );
   }, [mover.hasDesignatedRequest, mover.designatedEstimateStatus]);

   // 찜 상태 관리
   const [currentFavoriteState, setCurrentFavoriteState] = useState(
      isFavoritePage ? true : (mover.isFavorite ?? false),
   );

   useEffect(() => {
      if (!isFavoritePage) {
         setCurrentFavoriteState(mover.isFavorite ?? false);
      }
   }, [mover.isFavorite, isFavoritePage]);

   // 카드 클릭 핸들러
   const handleCardClick = useCallback(() => {
      startTransition(() => {
         router.push(`/mover-search/${mover.id}`);
      });
   }, [router, mover.id]);

   // 찜하기 핸들러 - Toast 사용
   const handleLikedClick = useCallback(
      async (e: React.MouseEvent) => {
         e.stopPropagation();

         // 기사님 로그인 상태 체크
         if (isLoggedInAsMover) {
            showToast("기사님은 다른 기사님을 찜할 수 없습니다.", false);
            return;
         }

         // 로그인 상태 체크
         if (!user) {
            showToast("로그인이 필요합니다.", false);
            return;
         }

         try {
            const result = await toggleFavoriteMover(mover.id);

            // 로컬 상태 업데이트
            setCurrentFavoriteState(result.isFavorite);

            // 부모 컴포넌트에 변경사항 알림
            onFavoriteChange?.(
               mover.id,
               result.isFavorite,
               result.favoriteCount || mover.favoriteCount,
            );

            // 성공 메시지 Toast로 표시
            const message =
               result.action === "added"
                  ? "찜 목록에 추가되었습니다."
                  : "찜 목록에서 제거되었습니다.";

            showToast(message, true);
         } catch (error) {
            console.error("찜 처리 중 오류:", error);

            // 에러 메시지를 Toast로 표시
            let errorMessage = "찜 처리 중 오류가 발생했습니다.";

            if (error instanceof Error) {
               if (error.message.includes("로그인")) {
                  errorMessage = "로그인이 필요합니다.";
               } else if (error.message.includes("권한")) {
                  errorMessage = "권한이 없습니다.";
               } else {
                  errorMessage =
                     error.message || "찜 처리 중 오류가 발생했습니다.";
               }
            }

            showToast(errorMessage, false);

            // 에러 시 원래 상태로 복구
            setCurrentFavoriteState((prev) => !prev);
         }
      },
      [
         isLoggedInAsMover,
         user,
         mover.id,
         mover.favoriteCount,
         onFavoriteChange,
         showToast,
      ],
   );

   // 카드 스타일을 메모이제이션
   const cardClassName = useMemo(() => {
      const baseClass =
         "flex h-48 w-full cursor-pointer items-center justify-center rounded-xl border border-gray-50 bg-white shadow-sm transition hover:shadow-md lg:h-56 lg:px-5";
      return isPending ? `${baseClass} opacity-75` : baseClass;
   }, [isPending]);

   return (
      <div onClick={handleCardClick} className={cardClassName}>
         {/* 로딩 인디케이터 */}
         {isPending && (
            <div className="absolute top-2 right-2 z-10">
               <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            </div>
         )}

         <div className="flex flex-col">
            {/* 서비스 타입 칩들 */}
            <div className="mb-2 flex items-center gap-2">
               {validServiceTypes.map((type) => (
                  <MoveChip key={type} type={type} mini={false} />
               ))}
               {shouldShowDesignated && (
                  <MoveChip type="DESIGNATED" mini={false} />
               )}
            </div>

            {/* 소개 텍스트 */}
            <div className="mb-4">
               <p className="text-14-medium md:text-16-medium lg:text-18-medium line-clamp-2 leading-relaxed break-words text-gray-700">
                  {mover.introduction ||
                     "고객님의 물품을 안전하게 운송해 드립니다."}
               </p>
            </div>

            {/* 기사님 프로필 */}
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
});
