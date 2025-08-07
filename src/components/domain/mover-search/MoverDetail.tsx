"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Mover } from "@/lib/types/auth.types";
import {
   getMoverByIdWithAuth,
   getMoverByIdWithoutAuth,
} from "@/lib/api/mover/getMover";
import { useAuth } from "@/context/AuthContext";
import { tokenSettings } from "@/lib/utils/auth.util";
import ActionButtons from "./ActionButtons";
import DetailSections from "./DetailSections";
import LineDivider from "../../common/LineDivider";
import DriverCard from "./DriverCard";
import SocialShareGroup from "@/components/common/SocialShareGroup";
import DashboardReviewSection from "@/components/domain/dashboard/ReviewSection";
import { useTranslations } from "next-intl";

export default function MoverDetail() {
   const t = useTranslations("MoverDetail");

   const params = useParams();
   const { user } = useAuth();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [mover, setMover] = useState<Mover | null>(null);

   useEffect(() => {
      const fetchMover = async () => {
         try {
            setLoading(true);
            const id = params.id as string;

            const hasToken = Boolean(tokenSettings.get());
            const isLoggedIn = Boolean(user);

            let moverData: Mover;

            if (hasToken && isLoggedIn) {
               moverData = await getMoverByIdWithAuth(id);
            } else {
               moverData = await getMoverByIdWithoutAuth(id);
            }

            setMover(moverData);
         } catch (err) {
            console.error("Error fetching mover:", err);
            setError(t("error.loadFailed"));
         } finally {
            setLoading(false);
         }
      };

      if (params.id) {
         fetchMover();
      }
   }, [params.id, user]);

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
               <p className="text-gray-600">{t("loading")}</p>
            </div>
         </div>
      );
   }

   if (error || !mover) {
      return (
         <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
               <p className="text-lg text-red-600">
                  {error || t("error.notFound")}
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
               // 🔥 onDesignatedEstimateSuccess prop 제거
            />
            <LineDivider />
            <div className="p-4">
               <SocialShareGroup text={t("shareText")} />
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
                  // 🔥 onDesignatedEstimateSuccess prop 제거
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
                  <SocialShareGroup text={t("shareText")} />
                  <div className="lg:hidden">
                     <LineDivider />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
