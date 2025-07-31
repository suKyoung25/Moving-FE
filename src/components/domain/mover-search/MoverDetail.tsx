"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Mover } from "@/lib/types/auth.types";
import {
   getMoverByIdWithAuth,
   getMoverByIdWithoutAuth,
} from "@/lib/api/mover/getMover";
import { useAuth } from "@/context/AuthContext"; // AuthContext 추가
import { tokenSettings } from "@/lib/utils/auth.util"; // 토큰 확인용
import ActionButtons from "./ActionButtons";
import DetailSections from "./DetailSections";
import LineDivider from "../../common/LineDivider";
import DriverCard from "./DriverCard";
import SocialShareGroup from "@/components/common/SocialShareGroup";
import DashboardReviewSection from "@/components/domain/dashboard/ReviewSection";

export default function MoverDetail() {
   const params = useParams();
   const { user } = useAuth(); // 로그인 상태 확인
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [mover, setMover] = useState<Mover | null>(null);

   useEffect(() => {
      const fetchMover = async () => {
         try {
            setLoading(true);
            const id = params.id as string;

            // 로그인 상태에 따라 다른 API 호출
            const hasToken = Boolean(tokenSettings.get());
            const isLoggedIn = Boolean(user);

            let moverData: Mover;

            if (hasToken && isLoggedIn) {
               // 로그인된 상태: 찜 상태 포함해서 조회
               moverData = await getMoverByIdWithAuth(id);
            } else {
               // 비로그인 상태: 찜 상태 없이 조회
               moverData = await getMoverByIdWithoutAuth(id);
            }

            setMover(moverData);
         } catch (err) {
            console.error("Error fetching mover:", err);
            setError("기사님 정보를 불러오는데 실패했습니다.");
         } finally {
            setLoading(false);
         }
      };

      if (params.id) {
         fetchMover();
      }
   }, [params.id, user]); // user 의존성 추가

   // 찜 상태 변경 핸들러
   const handleFavoriteChange = (
      moverId: string,
      isFavorite: boolean,
      favoriteCount: number,
   ) => {
      if (mover && mover.id === moverId) {
         setMover((prev) =>
            prev ? { ...prev, isFavorite, favoriteCount } : null,
         );
      }
   };

   // 지정견적 성공 핸들러
   const handleDesignatedEstimateSuccess = (moverId: string) => {
      if (mover && mover.id === moverId) {
         setMover((prev) =>
            prev
               ? {
                    ...prev,
                    hasDesignatedRequest: true,
                    designatedEstimateStatus: undefined,
                 }
               : null,
         );
      }
   };

   if (loading) {
      return (
         <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
               <div className="mx-auto mb-4 h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
               <p className="text-gray-600">로딩 중...</p>
            </div>
         </div>
      );
   }

   if (error || !mover) {
      return (
         <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
               <p className="text-lg text-red-600">
                  {error || "기사님 정보를 찾을 수 없습니다."}
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="flex w-full flex-col gap-4 lg:gap-6">
         {/* Mobile Layout - Stack vertically */}
         <div className="mx-auto flex w-80 flex-col gap-4 md:w-[36rem] lg:hidden lg:w-[60rem]">
            <DriverCard
               mover={mover}
               onFavoriteChange={handleFavoriteChange}
               onDesignatedEstimateSuccess={handleDesignatedEstimateSuccess}
            />
            <LineDivider />
            <div className="p-4">
               <SocialShareGroup text="나만 알기엔 아쉬운 기사님인가요?" />
               <div className="pt-5 lg:hidden">
                  <LineDivider />
               </div>
            </div>
            <DetailSections mover={mover} />
            <LineDivider />
            <div className="p-4">
               <DashboardReviewSection moverId={mover.id} />
            </div>
            <ActionButtons
               mover={mover}
               onDesignatedEstimateSuccess={handleDesignatedEstimateSuccess}
               onFavoriteChange={handleFavoriteChange}
            />
         </div>

         {/* Desktop Layout - Side by side */}
         <div className="hidden lg:flex lg:flex-row lg:justify-between lg:gap-6">
            <div className="flex w-full flex-col gap-6 lg:w-2/3">
               <DriverCard
                  mover={mover}
                  onFavoriteChange={handleFavoriteChange}
                  onDesignatedEstimateSuccess={handleDesignatedEstimateSuccess}
               />
               <LineDivider />
               <DetailSections mover={mover} />
               <LineDivider />
               <DashboardReviewSection moverId={mover.id} />
            </div>

            <div className="flex w-full flex-col gap-6 lg:w-1/3">
               <ActionButtons
                  mover={mover}
                  onDesignatedEstimateSuccess={handleDesignatedEstimateSuccess}
                  onFavoriteChange={handleFavoriteChange}
               />
               <div className="hidden lg:block">
                  <LineDivider />
               </div>
               <div className="lg:p-5">
                  <SocialShareGroup text="나만 알기엔 아쉬운 기사님인가요?" />
                  <div className="lg:hidden">
                     <LineDivider />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
