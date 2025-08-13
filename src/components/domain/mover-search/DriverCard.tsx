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

   // 찜하기 핸들러
   const handleLikedClick = useCallback(
      async (e: React.MouseEvent) => {
         e.stopPropagation();

         // 기사님 로그인 상태 체크
         if (isLoggedInAsMover) {
            showError(t("error.loggedInAsMover"));
            return;
         }

         // 로그인 상태 체크
         if (!user) {
            setIsLoginModalOpen(true);
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

            // 다국어 처리된 성공 메시지
            const message =
               result.action === "added"
                  ? t("toast.addedToFavorites")
                  : t("toast.removedFromFavorites");

            showSuccess(message);
         } catch (error) {
            console.error("찜 처리 중 오류:", error);

            let errorMessage = t("error.toggleFailed");
            if (error instanceof Error) {
               if (error.message.includes("로그인")) {
                  setIsLoginModalOpen(true);
                  return;
               } else {
                  errorMessage = error.message;
               }
            }

            showError(errorMessage);
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
         showSuccess,
         showError,
         t,
      ],
   );

   const handleChatClick = async (e: React.MouseEvent) => {
      e.stopPropagation();

      const clientId = user!.id;
      const moverId = mover!.id;
      const moverName = mover.nickName!;
      const clientName = user!.name!;
      const chatId = `${mover.id}_${user!.id}`;

      // 프로필 이미지 추가 (빈 값이면 기본 이미지 처리됨)
      const moverProfileImage = mover.profileImage || "";
      const clientProfileImage = user!.profileImage || "";

      await initializeChatRoom({
         chatId,
         moverId,
         moverName,
         moverProfileImage,
         clientId,
         clientName,
         clientProfileImage,
         initiatorId: user!.id, // 현재 사용자가 채팅을 시작함
      });

      setChatId(chatId);
      openHub();
   };

   // 카드 스타일을 메모이제이션
   const cardClassName = useMemo(() => {
      const baseClass =
         "px-3.5 lg:px-6 py-4 lg:py-5 overflow-hidden  cursor-pointer  rounded-2xl  items-center justify-center  border border-line-100 bg-white  ";
      return isPending ? `${baseClass}` : baseClass;
   }, [isPending]);

   return (
      <div className="overflow-hidden rounded-2xl">
         <div onClick={handleCardClick} className={cardClassName}>
            <div className="flex flex-col gap-3 md:gap-4 lg:gap-5">
               {/* 서비스 타입 칩들 */}
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     {validServiceTypes.map((type) => (
                        <MoveChip key={type} type={type} mini={false} />
                     ))}
                     {shouldShowDesignated && (
                        <MoveChip type="DESIGNATED" mini={false} />
                     )}
                  </div>
                  {user?.userType === "client" && (
                     <ChatButton onClick={handleChatClick} />
                  )}
               </div>

               {/* 소개 텍스트 */}
               <div className="">
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
                     showHeart={!isLoggedInAsMover}
                  />
               </div>
            </div>
         </div>

         {/* 모달을 카드 외부로 이동 */}
         <LoginRequiredModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
         />
      </div>
   );
});
