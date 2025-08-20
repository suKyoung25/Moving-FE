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
import { useAuth } from "@/context/AuthContext";
import { tokenSettings } from "@/lib/utils/auth.util";
import ActionButtons from "./ActionButtons";
import DetailSections from "./DetailSections";
import LineDivider from "../../common/LineDivider";
import DriverCard from "./DriverCard";
import SocialShareGroup from "@/components/common/SocialShareGroup";
import { useLocale, useTranslations } from "next-intl";
import Spinner from "@/components/common/Spinner";
import { getMoverByIdWithAuth, getMoverByIdWithoutAuth } from "@/lib/api/mover/requests/getMover";

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

const ErrorDisplay = memo(function ErrorDisplay({
   error,
   onRetry,
   retryText,
}: {
   error: string;
   onRetry: () => void;
   retryText: string;
}) {
   return (
      <div className="flex min-h-screen items-center justify-center">
         <div className="text-center">
            <p className="mb-4 text-lg text-red-600">{error}</p>
            <button
               onClick={onRetry}
               className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
               {retryText}
            </button>
         </div>
      </div>
   );
});

// ✅ 상태 타입 정의
interface MoverDetailState {
   loading: boolean;
   error: string | null;
   mover: Mover | null;
}

export default memo(function MoverDetail() {
   const t = useTranslations("MoverDetail");
   const locale = useLocale();
   const params = useParams();
   const { user } = useAuth();

   // ✅ 상태를 하나의 객체로 통합
   const [state, setState] = useState<MoverDetailState>({
      loading: true,
      error: null,
      mover: null,
   });

   // ✅ moverId를 메모이제이션
   const moverId = useMemo(() => params.id as string, [params.id]);

   // ✅ 인증 상태를 메모이제이션
   const authState = useMemo(
      () => ({
         hasToken: Boolean(tokenSettings.get()),
         isLoggedIn: Boolean(user),
      }),
      [user],
   );

   // ✅ API 호출 함수를 메모이제이션
   const fetchMover = useCallback(async () => {
      if (!moverId) return;

      try {
         setState((prev) => ({ ...prev, loading: true, error: null }));

         const moverData =
            authState.hasToken && authState.isLoggedIn
               ? await getMoverByIdWithAuth(moverId, locale)
               : await getMoverByIdWithoutAuth(moverId, locale);

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
   }, [moverId, authState.hasToken, authState.isLoggedIn, locale, t]);

   // ✅ 초기 데이터 로드
   useEffect(() => {
      fetchMover();
   }, [fetchMover]);

   // ✅ 찜하기 변경 핸들러
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

   // ✅ 지정 견적 성공 핸들러
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

   // ✅ 재시도 핸들러
   const handleRetry = useCallback(() => {
      fetchMover();
   }, [fetchMover]);

   // ✅ 공유 텍스트를 메모이제이션
   const shareText = useMemo(() => t("shareText"), [t]);

   // 로딩 상태
   if (state.loading) {
      return <Spinner />;
   }

   // 에러 상태
   if (state.error || !state.mover) {
      return (
         <ErrorDisplay
            error={state.error || t("error.notFound")}
            onRetry={handleRetry}
            retryText={t("retry")}
         />
      );
   }

   const { mover } = state;

   return (
      <div className="flex w-full flex-col gap-4 lg:gap-6">
         {/* ✅ 모바일 레이아웃만 사용 (데스크탑 레이아웃 주석 처리됨) */}
         <div className="flex flex-col gap-4">
            <DriverCard mover={mover} onFavoriteChange={handleFavoriteChange} />

            <div className="p-4">
               <SocialShareGroup text={shareText} />
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
      </div>
   );
});
