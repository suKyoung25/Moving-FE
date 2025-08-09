"use client";

import { Mover } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import FavoriteButton from "./FavoriteButton";
import { EstimateRequestButton } from "./EstimateRequestButton";
import { useState } from "react";
import ResultModal from "@/components/common/ResultModal";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface ActionButtonsProps {
   mover: Mover;
   onDesignatedEstimateSuccess?: (moverId: string) => void;
   onFavoriteChange?: (
      moverId: string,
      isFavorite: boolean,
      favoriteCount: number,
   ) => void;
}

export default function ActionButtons({
   mover,
   onDesignatedEstimateSuccess,
   onFavoriteChange,
}: ActionButtonsProps) {
   const t = useTranslations("MoverDetail");

   const { user } = useAuth();
   const [isResultModalOpen, setIsResultModalOpen] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const router = useRouter();

   const isLoggedInAsMover = user?.userType === "mover";

   if (isLoggedInAsMover) {
      return null;
   }

   return (
      <>
         {/* Desktop Layout - 사이드바에 고정 */}
         <div className="hidden lg:block lg:p-5">
            <div className="mb-4">
               <p className="text-14-semibold lg:text-20-bold mb-1">
                  {mover.nickName} {t("requestDesignatedEstimate")}
               </p>
            </div>

            <div className="flex flex-col space-y-3">
               <FavoriteButton
                  mover={mover}
                  onFavoriteChange={onFavoriteChange}
               />
               <EstimateRequestButton
                  moverId={mover.id}
                  mover={mover}
                  onDesignatedEstimateSuccess={onDesignatedEstimateSuccess}
                  setErrorMessage={setErrorMessage}
                  setIsResultModalOpen={setIsResultModalOpen}
               />
            </div>
         </div>

         {/* Mobile Layout - 하단 floating */}
         <div className="lg:hidden">
            <div className="fixed right-0 bottom-0 left-0 z-50">
               <div className="mx-auto flex w-80 flex-row space-x-3 p-4 md:w-[36rem]">
                  <FavoriteButton
                     mover={mover}
                     onFavoriteChange={onFavoriteChange}
                  />
                  <EstimateRequestButton
                     moverId={mover.id}
                     mover={mover}
                     onDesignatedEstimateSuccess={onDesignatedEstimateSuccess}
                     setErrorMessage={setErrorMessage}
                     setIsResultModalOpen={setIsResultModalOpen}
                  />
               </div>
            </div>
            {/* 하단 floating 버튼을 위한 여백 */}
            <div className="h-20"></div>
         </div>

         {isResultModalOpen && (
            <ResultModal
               isOpen={isResultModalOpen}
               message={errorMessage}
               buttonText={t("goToLogin")}
               onClose={() => setIsResultModalOpen(false)}
               onClick={() => router.push("/sign-in/client")}
            />
         )}
      </>
   );
}
