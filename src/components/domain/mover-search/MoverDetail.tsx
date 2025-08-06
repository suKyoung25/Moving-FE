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
import { useTranslations } from "next-intl";
// 무거운 컴포넌트들을 lazy 로딩으로 최적화
const DashboardReviewSection = lazy(
   () => import("@/components/domain/dashboard/ReviewSection"),
);

// 로딩 스켈레톤 컴포넌트들 - displayName 추가
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

// 로딩과 에러 컴포넌트를 memo로 최적화
const LoadingSpinner = memo(function LoadingSpinner() {
   const t = useTranslations("MoverDetail");
   return (
      <div className="flex min-h-screen items-center justify-center">
         <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">{t("loadingMessage")}</p>
         </div>
      </div>
   );
});

const ErrorDisplay = memo(function ErrorDisplay({ error }: { error: string }) {
   const t = useTranslations("MoverDetail");
   return (
      <div className="flex min-h-screen items-center justify-center">
         <div className="text-center">
            <p className="text-lg text-red-600">{error}</p>
         </div>
      </div>
   );
});

// 메인 컴포넌트 최적화
export default memo(function MoverDetail() {
   const t = useTranslations("MoverDetail");
   const params = useParams();
   const { user } = useAuth();

   // 상태를 하나의 객체로 관리
   const [state, setState] = useState({
      loading: true,
      error: null as string | null,
      mover: null as Mover | null,
   });

   // 계산값들을 메모이제이션
   const moverId = useMemo(() => params.id as string, [params.id]);

   const authState = useMemo(
      () => ({
         hasToken: Boolean(tokenSettings.get()),
         isLoggedIn: Boolean(user),
      }),
      [user],
   );

   // 데이터 페칭 최적화
   const fetchMover = useCallback(async () => {
      if (!moverId) return;

      try {
         setState((prev) => ({ ...prev, loading: true, error: null }));

         const fetchPromise =
            authState.hasToken && authState.isLoggedIn
               ? getMoverByIdWithAuth(moverId)
               : getMoverByIdWithoutAuth(moverId);

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
   }, [moverId, authState.hasToken, authState.isLoggedIn]);

   useEffect(() => {
      fetchMover();
   }, [fetchMover]);

   //  이벤트 핸들러 + useCallback으로 최적화
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

   // 조기 리턴으로 성능 최적화
   if (state.loading) return <LoadingSpinner />;
   if (state.error || !state.mover) {
      return <ErrorDisplay error={state.error || t("error.notFound")} />;
   }

   const { mover } = state;

   return (
      <div className="flex w-full flex-col gap-4 lg:gap-6">
         {/* Mobile Layout */}
         <div className="mx-auto flex w-80 flex-col gap-4 md:w-[36rem] lg:hidden lg:w-[60rem]">
            <DriverCard mover={mover} onFavoriteChange={handleFavoriteChange} />
            <LineDivider />
            <div className="p-4">
               <SocialShareGroup text={t("shareText")} />
               <div className="pt-5 lg:hidden">
                  <LineDivider />
               </div>
            </div>
            <DetailSections mover={mover} />
            <LineDivider />

            {/* 리뷰 섹션을 lazy 로딩 */}
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

         {/* Desktop Layout */}
         <div className="hidden lg:flex lg:flex-row lg:justify-between lg:gap-6">
            <div className="flex w-full flex-col gap-6 lg:w-2/3">
               <DriverCard
                  mover={mover}
                  onFavoriteChange={handleFavoriteChange}
               />
               <LineDivider />
               <DetailSections mover={mover} />
               <LineDivider />

               {/* 데스크톱에서도 리뷰 섹션 lazy 로딩 */}
               <Suspense fallback={<ReviewSectionSkeleton />}>
                  <DashboardReviewSection moverId={mover.id} />
               </Suspense>
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
});
