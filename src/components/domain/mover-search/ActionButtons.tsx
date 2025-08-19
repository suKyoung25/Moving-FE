"use client";

import { Mover } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import FavoriteButton from "./FavoriteButton";
import { EstimateRequestButton } from "./EstimateRequestButton";
import { useState } from "react";
import ResultModal from "@/components/common/ResultModal";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import SocialShareGroup from "@/components/common/SocialShareGroup";
import LineDivider from "@/components/common/LineDivider";

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

   const shareText = t("shareText");
   const isLoggedInAsMover = user?.userType === "mover";

   // mover가 없거나 로그인된 기사라면 렌더링하지 않음
   if (!mover || isLoggedInAsMover) {
      return null;
   }

   return (
      <>
         {/* Desktop Layout - 사이드바용 */}
         <div className="hidden lg:block">
            <div className="w-full space-y-4 p-4">
               {/* 맨 위 텍스트 */}
               <div className="text-14-semibold lg:text-18-bold">
                  {mover?.nickName || "기사"} 기사님에게 지정 견적을
                  요청해보세요!
               </div>

               {/* 찜하기 버튼 (첫 번째) */}
               <div className="[&>*]:w-full [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:space-x-2 [&>button]:rounded-lg [&>button]:border [&>button]:border-gray-300 [&>button]:px-4 [&>button]:py-3 [&>button]:font-medium [&>button]:text-gray-700 [&>button]:transition-colors [&>button]:hover:bg-gray-50">
                  <FavoriteButton
                     mover={mover}
                     onFavoriteChange={onFavoriteChange}
                  />
               </div>

               {/* 견적요청 버튼 (두 번째) */}
               <div className="[&>button]:bg-primary-blue-300 [&>button]:hover:bg-primary-blue-200 space-y-3 pb-6 [&>*]:w-full [&>button]:rounded-lg [&>button]:px-4 [&>button]:py-3 [&>button]:font-medium [&>button]:text-white [&>button]:transition-colors">
                  <EstimateRequestButton
                     moverId={mover?.id || ""}
                     mover={mover}
                     onDesignatedEstimateSuccess={onDesignatedEstimateSuccess}
                     setErrorMessage={setErrorMessage}
                     setIsResultModalOpen={setIsResultModalOpen}
                  />
               </div>

               <LineDivider />

               {/* 공유 섹션 */}
               <div className="pt-6">
                  <SocialShareGroup text={shareText} />
               </div>
            </div>
         </div>

         {/* Mobile/Tablet Layout - 하단 floating */}
         <div className="fixed right-0 bottom-0 left-0 z-50 bg-white shadow-lg lg:hidden">
            <div className="flex space-x-3 p-4">
               <div className="flex-shrink-0 [&>*]:h-12 [&>*]:w-12 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:rounded-lg [&>button]:border [&>button]:border-gray-300 [&>button]:transition-colors [&>button]:hover:bg-gray-50">
                  <FavoriteButton
                     mover={mover}
                     onFavoriteChange={onFavoriteChange}
                  />
               </div>

               <div className="[&>button]:bg-primary-blue-300 [&>button]:hover:bg-primary-blue-200 flex-1 [&>*]:w-full [&>button]:rounded-lg [&>button]:px-4 [&>button]:py-3 [&>button]:font-medium [&>button]:text-white [&>button]:transition-colors">
                  <EstimateRequestButton
                     moverId={mover?.id || ""}
                     mover={mover}
                     onDesignatedEstimateSuccess={onDesignatedEstimateSuccess}
                     setErrorMessage={setErrorMessage}
                     setIsResultModalOpen={setIsResultModalOpen}
                  />
               </div>
            </div>
         </div>

         {/* 모바일에서 하단 버튼으로 인한 컨텐츠 가려짐 방지 */}
         <div className="h-20 lg:hidden"></div>

         {isResultModalOpen && (
            <ResultModal
               isOpen={isResultModalOpen}
               message={errorMessage}
               onClose={() => setIsResultModalOpen(false)}
               onClick={() => router.push("/sign-in/client")}
            />
         )}
      </>
   );
}
