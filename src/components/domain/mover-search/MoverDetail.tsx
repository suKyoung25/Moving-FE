"use client";

import React, {
   useState,
   useEffect,
   useCallback,
   useMemo,
   memo,
   lazy,
   Suspense,
} from "react";
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
import { useLocale, useTranslations } from "next-intl";
import Spinner from "@/components/common/Spinner";

const DashboardReviewSection = lazy(
   () => import("@/components/domain/dashboard/ReviewSection"),
);

const ReviewSectionSkeleton = memo(function ReviewSectionSkeleton() {
   return (
      <div className="animate-pulse p-4">
         <div className="mb-4 h-6 w-32 rounded bg-gray-200"></div>
         {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4 rounded border p-4">
               <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
               <div className="h-3 w-1/2 rounded bg-gray-200"></div>
            </div>
         ))}
      </div>
   );
});

const ErrorDisplay = memo(function ErrorDisplay({ error }: { error: string }) {
   return (
      <div className="flex min-h-screen items-center justify-center">
         <div className="text-center">
            <p className="text-lg text-red-600">{error}</p>
         </div>
      </div>
   );
});

// 🔧 Main component - t is used properly here
export default memo(function MoverDetail() {
   const t = useTranslations("MoverDetail");
   const locale = useLocale();
   const params = useParams();
   const { user } = useAuth();

   const [state, setState] = useState({
      loading: true,
      error: null as string | null,
      mover: null as Mover | null,
   });

   const moverId = useMemo(() => params.id as string, [params.id]);

   const authState = useMemo(
      () => ({
         hasToken: Boolean(tokenSettings.get()),
         isLoggedIn: Boolean(user),
      }),
      [user],
   );

   const fetchMover = useCallback(async () => {
      if (!moverId) return;

      try {
         setState((prev) => ({ ...prev, loading: true, error: null }));

         const fetchPromise =
            authState.hasToken && authState.isLoggedIn
               ? getMoverByIdWithAuth(moverId, locale)
               : getMoverByIdWithoutAuth(moverId, locale);

         const moverData = await fetchPromise;

         setState({
            loading: false,
            error: null,
            mover: moverData,
         });
      } catch (err) {
         console.error("Error fetching mover:", err);
         setState({
            loading: false,
            error: t("error.loadFailed"),
            mover: null,
         });
      }
   }, [moverId, authState.hasToken, authState.isLoggedIn, t, locale]);

   useEffect(() => {
      fetchMover();
   }, [fetchMover]);

   const handleFavoriteChange = useCallback(
      (moverId: string, isFavorite: boolean, favoriteCount: number) => {
         setState((prev) => {
            if (!prev.mover || prev.mover.id !== moverId) return prev;
            return {
               ...prev,
               mover: { ...prev.mover, isFavorite, favoriteCount },
            };
         });
      },
      [],
   );

   const handleDesignatedEstimateSuccess = useCallback((moverId: string) => {
      setState((prev) => {
         if (!prev.mover || prev.mover.id !== moverId) return prev;
         return {
            ...prev,
            mover: {
               ...prev.mover,
               hasDesignatedRequest: true,
               designatedEstimateStatus: undefined,
            },
         };
      });
   }, []);

   if (state.loading) return <Spinner />;
   if (state.error || !state.mover) {
      return <ErrorDisplay error={state.error || t("error.notFound")} />;
   }

   const { mover } = state;

   return (
      <div className="flex w-full flex-col gap-4 lg:gap-6">
         {/* Mobile Layout */}
         <div className="flex flex-col gap-4">
            <DriverCard mover={mover} onFavoriteChange={handleFavoriteChange} />
            <div className="p-4">
               <SocialShareGroup text={t("shareText")} />
               <div className="pt-5 lg:hidden">
                  <LineDivider />
               </div>
            </div>
            <DetailSections mover={mover} />
            <LineDivider />

            <div className="p-4">
               <Suspense fallback={<ReviewSectionSkeleton />}>
                  <DashboardReviewSection moverId={mover.id} />
               </Suspense>
            </div>

            <ActionButtons
               mover={mover}
               onDesignatedEstimateSuccess={handleDesignatedEstimateSuccess}
               onFavoriteChange={handleFavoriteChange}
            />
         </div>
         {/* Desktop Layout
         <div className="hidden lg:block">
            <div className="flex w-full flex-col gap-6">
               <DriverCard
                  mover={mover}
                  onFavoriteChange={handleFavoriteChange}
               />
               <LineDivider />
               <DetailSections mover={mover} />
               <LineDivider />

               <Suspense fallback={<ReviewSectionSkeleton />}>
                  <DashboardReviewSection moverId={mover.id} />
               </Suspense>
            </div>

            <div className="flex w-full flex-col gap-6">
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
         </div> */}
      </div>
   );
});
