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
import { validateServiceTypes } from "@/lib/utils/moveChip.util";
import { toggleFavoriteMover } from "@/lib/api/mover/favoriteMover";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastConText";
import { EstimateStatus, Mover } from "@/lib/types";
import { useTranslations } from "next-intl";
import LoginRequiredModal from "./LoginRequiredModal";
import { useChat } from "@/context/ChatContext";
import { initializeChatRoom } from "@/lib/firebase/firebaseChat";
import { useSupportHub } from "@/context/SupportHubContext";
import ChatButton from "@/components/common/Chatbutton";

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
   const t = useTranslations("MoverSearch");

   const { openHub } = useSupportHub();
   const router = useRouter();
   const pathname = usePathname();
   const { user } = useAuth();
   const { setChatId } = useChat();
   const { showSuccess, showError } = useToast();

   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
   const [isPending, startTransition] = useTransition();

   // ✅ 계산값들을 메모이제이션 - 한 번에 처리
   const computedValues = useMemo(() => ({
      isLoggedInAsMover: user?.userType === "mover",
      isFavoritePage: pathname.includes("favorite-movers"),
      validServiceTypes: validateServiceTypes(mover.serviceType!),
      shouldShowDesignated: !!(
         mover.hasDesignatedRequest &&
         mover.designatedEstimateStatus !== EstimateStatus.CONFIRMED &&
         mover.designatedEstimateStatus !== EstimateStatus.REJECTED
      ),
   }), [user?.userType, pathname, mover.serviceType, mover.hasDesignatedRequest, mover.designatedEstimateStatus]);

   // ✅ 찜 상태 관리 - 간소화
   const [currentFavoriteState, setCurrentFavoriteState] = useState(() => 
      computedValues.isFavoritePage ? true : (mover.isFavorite ?? false)
   );

   // ✅ mover.isFavorite 변경 시에만 업데이트
   useEffect(() => {
      if (!computedValues.isFavoritePage) {
         setCurrentFavoriteState(mover.isFavorite ?? false);
      }
   }, [mover.isFavorite, computedValues.isFavoritePage]);

   // ✅ 카드 클릭 핸들러
   const handleCardClick = useCallback(() => {
      startTransition(() => {
         router.push(`/mover-search/${mover.id}`);
      });
   }, [router, mover.id]);

   // ✅ 찜하기 핸들러 - 최적화 및 오류 수정
   const handleLikedClick = useCallback(
      async (e: React.MouseEvent) => {
         e.stopPropagation();

         // 기사님 로그인 상태 체크
         if (computedValues.isLoggedInAsMover) {
            showError(t("error.loggedInAsMover"));
            return;
         }

         // 로그인 상태 체크
         if (!user) {
            setIsLoginModalOpen(true);
            return;
         }

         // ✅ 오류 수정: const 키워드 추가
         const newFavoriteState = !currentFavoriteState;

         try {
            // 낙관적 업데이트
            setCurrentFavoriteState(newFavoriteState);

            const result = await toggleFavoriteMover(mover.id);

            // 실제 결과로 업데이트
            setCurrentFavoriteState(result.isFavorite);

            // 부모 컴포넌트에 변경사항 알림
            onFavoriteChange?.(
               mover.id,
               result.isFavorite,
               result.favoriteCount || mover.favoriteCount,
            );

            // 성공 메시지
            const message = result.action === "added"
               ? t("toast.addedToFavorites")
               : t("toast.removedFromFavorites");

            showSuccess(message);
         } catch (error) {
            console.error("찜 처리 중 오류:", error);

            // ✅ 에러 시 원래 상태로 복구
            setCurrentFavoriteState(!newFavoriteState);

            if (error instanceof Error && error.message.includes("로그인")) {
               setIsLoginModalOpen(true);
               return;
            }

            showError(t("error.toggleFailed"));
         }
      },
      [
         computedValues.isLoggedInAsMover,
         user,
         currentFavoriteState,
         mover.id,
         mover.favoriteCount,
         onFavoriteChange,
         showSuccess,
         showError,
         t,
      ],
   );

   // ✅ 채팅 클릭 핸들러 - 최적화
   const handleChatClick = useCallback(async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!user) return;

      const chatId = `${mover.id}_${user.id}`;

      await initializeChatRoom({
         chatId,
         moverId: mover.id,
         moverName: mover.nickName!,
         moverProfileImage: mover.profileImage || "",
         clientId: user.id,
         clientName: user.name!,
         clientProfileImage: user.profileImage || "",
         initiatorId: user.id,
      });

      setChatId(chatId);
      openHub();
   }, [user, mover.id, mover.nickName, mover.profileImage, setChatId, openHub]);

   // ✅ 카드 스타일을 메모이제이션
   const cardClassName = useMemo(() => {
      const baseClass = "px-3.5 lg:px-6 py-4 lg:py-5 overflow-hidden cursor-pointer rounded-2xl items-center justify-center border border-line-100 bg-white";
      return isPending ? `${baseClass} opacity-75` : baseClass;
   }, [isPending]);

   return (
      <div className="overflow-hidden rounded-2xl">
         <div onClick={handleCardClick} className={cardClassName}>
            <div className="flex flex-col gap-3 md:gap-4 lg:gap-5">
               {/* 서비스 타입 칩들 */}
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     {computedValues.validServiceTypes.map((type) => (
                        <MoveChip key={type} type={type} mini={false} />
                     ))}
                     {computedValues.shouldShowDesignated && (
                        <MoveChip type="DESIGNATED" mini={false} />
                     )}
                  </div>
                  {user?.userType === "client" && (
                     <ChatButton onClick={handleChatClick} />
                  )}
               </div>

               {/* 소개 텍스트 */}
               <div>
                  <p className="text-16-semibold lg:text-22-semibold line-clamp-2 leading-relaxed break-words">
                     {mover.introduction || t("defaultIntroduction")}
                  </p>
               </div>

               {/* 기사님 프로필 */}
               <div>
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
                     showHeart={!computedValues.isLoggedInAsMover}
                  />
               </div>
            </div>
         </div>

         {/* 모달 */}
         <LoginRequiredModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
         />
      </div>
   );
});