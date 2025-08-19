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
         <div>
            <div>
               <div className="flex flex-row space-x-3 p-4">
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
