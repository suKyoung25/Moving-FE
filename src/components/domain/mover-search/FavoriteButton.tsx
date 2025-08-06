"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Mover } from "@/lib/types";
import heart from "@/assets/images/likeFilledIcon.svg";
import inActiveHeart from "@/assets/images/likeOutlineIcon.svg";
import { toggleFavoriteMover } from "@/lib/api/mover/favoriteMover";
import { useTranslations } from "next-intl";

interface FavoriteButtonProps {
   mover: Mover;
   onFavoriteChange?: (
      moverId: string,
      isFavorite: boolean,
      favoriteCount: number,
   ) => void;
   setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
   setIsResultModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FavoriteButton({
   mover,
   onFavoriteChange,
   setErrorMessage,
   setIsResultModalOpen,
}: FavoriteButtonProps) {
   const t = useTranslations("MoverDetail");

   const [isLoading, setIsLoading] = useState(false);
   const [isFavorite, setIsFavorite] = useState(mover.isFavorite ?? false);

   useEffect(() => {
      setIsFavorite(mover.isFavorite ?? false);
   }, [mover.isFavorite, mover.favoriteCount]);

   const handleClick = async () => {
      if (isLoading) return;

      setIsLoading(true);

      try {
         const result = await toggleFavoriteMover(mover.id);

         // 서버 응답으로 UI 업데이트
         setIsFavorite(result.isFavorite);

         // 🔥 부모 컴포넌트에 상태 변경 알림
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
         console.error("찜 처리 실패:", error);

         let errorMessage = t("errorOccurred");
         if (error instanceof Error) {
            if (error.message.includes("로그인")) {
               errorMessage = t("loginRequired");
            } else {
               errorMessage = error.message;
            }
         }

         setErrorMessage(errorMessage);
         setIsResultModalOpen(true);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <button
         onClick={handleClick}
         disabled={isLoading}
         className={`flex w-13 items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium transition-colors lg:w-full ${
            isLoading
               ? "cursor-not-allowed bg-gray-100 text-gray-400"
               : "border-line-200 text-gray-700 hover:bg-gray-50"
         }`}
      >
         <span className="text-lg">
            <Image
               src={isFavorite ? heart : inActiveHeart}
               alt={isFavorite ? t("alt.unfavorite") : t("alt.favorite")}
               className="h-6 w-8"
            />
         </span>
         <span className="hidden lg:block">
            {isLoading
               ? t("loading")
               : isFavorite
                 ? t("unfavorite")
                 : t("favoriteDriver")}
         </span>
      </button>
   );
}
