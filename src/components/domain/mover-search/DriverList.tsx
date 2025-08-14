"use client";

import { useState, useEffect, useCallback, memo } from "react";
import DriverCard from "./DriverCard";
import { getMovers } from "@/lib/api/mover/getMover";
import { GetMoversParams } from "@/lib/types/mover.types";
import { areaMapping } from "@/constants/mover.constants";
import { tokenSettings } from "@/lib/utils/auth.util";
import type { Mover } from "@/lib/types";
import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll";
import { useLocale, useTranslations } from "next-intl";
import DriverCardSkeleton from "./DriverCardSkeleton";
import SkeletonLayout from "@/components/common/SkeletonLayout";

interface DriverListProps {
   filters: {
      search: string;
      area: string;
      serviceType: string;
      sortBy: string;
   };
   onFavoriteChange?: (
      moverId: string,
      isFavorite: boolean,
      favoriteCount: number,
   ) => void;
   refreshKey?: number;
}

export default memo(function DriverList({
   filters,
   onFavoriteChange,
   refreshKey,
}: DriverListProps) {
   const t = useTranslations("MoverSearch");
   const locale = useLocale();

   const [movers, setMovers] = useState<Mover[]>([]);
   const [loading, setLoading] = useState(false);
   const [isAppending, setIsAppending] = useState(false); // 추가 로딩 상태
   const [error, setError] = useState<string | null>(null);
   const [hasMore, setHasMore] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);

   const loadMovers = useCallback(
      async (reset = false) => {
         try {
            setError(null);
            if (reset) {
               setLoading(true);
               setIsAppending(false);
            } else {
               setIsAppending(true);
            }

            const targetPage = reset ? 1 : currentPage;

            let area = filters.area !== "all" ? filters.area : undefined;
            if (area && areaMapping[area]) {
               area = areaMapping[area][0];
            }

            const params: GetMoversParams = {
               page: targetPage,
               limit: 10,
               search: filters.search || undefined,
               area,
               serviceType:
                  filters.serviceType !== "all"
                     ? filters.serviceType
                     : undefined,
               sortBy: filters.sortBy,
            };

            const hasToken = Boolean(tokenSettings.get());
            const response = await getMovers(params, hasToken, locale);

            if (reset) {
               setMovers(response.movers);
               setCurrentPage(2);
            } else {
               setMovers((prev) => {
                  const existingIds = new Set(prev.map((m) => m.id));
                  const newMovers = response.movers.filter(
                     (m) => !existingIds.has(m.id),
                  );
                  return [...prev, ...newMovers];
               });
               setCurrentPage((prev) => prev + 1);
            }

            setHasMore(response.hasMore);
         } catch (err) {
            console.error("Load movers error:", err);
            setError(t("loadFailed"));
         } finally {
            setLoading(false);
            setIsAppending(false);
         }
      },
      [
         filters.area,
         filters.search,
         filters.serviceType,
         filters.sortBy,
         currentPage,
         t,
         locale,
      ],
   );

   const loadMore = useCallback(() => {
      if (!hasMore || loading || isAppending) return;
      loadMovers(false);
   }, [hasMore, loading, isAppending, loadMovers]);

   const { setLoadingRef } = useInfiniteScroll({
      hasMore,
      isLoading: loading || isAppending,
      onLoadMore: loadMore,
      rootMargin: "100px",
      threshold: 0.1,
   });

   const handleFavoriteChange = useCallback(
      (moverId: string, isFavorite: boolean, favoriteCount: number) => {
         setMovers((prev) =>
            prev.map((mover) =>
               mover.id === moverId
                  ? { ...mover, isFavorite, favoriteCount }
                  : mover,
            ),
         );
         onFavoriteChange?.(moverId, isFavorite, favoriteCount);
      },
      [onFavoriteChange],
   );

   useEffect(() => {
      if (refreshKey && refreshKey > 0) {
         const refreshFavoriteStates = async () => {
            try {
               const currentMovers = movers;
               const currentMoverIds = currentMovers.map((m) => m.id);

               let area = filters.area !== "all" ? filters.area : undefined;
               if (area && areaMapping[area]) {
                  area = areaMapping[area][0];
               }

               const params: GetMoversParams = {
                  page: 1,
                  limit: Math.max(currentMoverIds.length, 10),
                  search: filters.search || undefined,
                  area,
                  serviceType:
                     filters.serviceType !== "all"
                        ? filters.serviceType
                        : undefined,
                  sortBy: filters.sortBy,
               };

               const hasToken = Boolean(tokenSettings.get());
               const response = await getMovers(params, hasToken, locale);

               setMovers((prev) =>
                  prev.map((existingMover) => {
                     const updatedMover = response.movers.find(
                        (m) => m.id === existingMover.id,
                     );
                     if (updatedMover) {
                        return {
                           ...existingMover,
                           isFavorite: updatedMover.isFavorite,
                           favoriteCount: updatedMover.favoriteCount,
                           hasDesignatedRequest:
                              updatedMover.hasDesignatedRequest,
                           designatedEstimateStatus:
                              updatedMover.designatedEstimateStatus,
                        };
                     }
                     return existingMover;
                  }),
               );
            } catch (err) {
               console.error("찜 상태 새로고침 실패:", err);
            }
         };

         refreshFavoriteStates();
      }
   }, [
      refreshKey,
      filters.area,
      filters.search,
      filters.serviceType,
      filters.sortBy,
      movers,
   ]);

   useEffect(() => {
      setCurrentPage(1);
      setHasMore(true);

      const loadData = async () => {
         try {
            setLoading(true);
            setError(null);

            let area = filters.area !== "all" ? filters.area : undefined;
            if (area && areaMapping[area]) {
               area = areaMapping[area][0];
            }

            const params: GetMoversParams = {
               page: 1,
               limit: 10,
               search: filters.search || undefined,
               area,
               serviceType:
                  filters.serviceType !== "all"
                     ? filters.serviceType
                     : undefined,
               sortBy: filters.sortBy,
            };

            const hasToken = Boolean(tokenSettings.get());
            const response = await getMovers(params, hasToken, locale);

            setMovers(response.movers);
            setCurrentPage(2);
            setHasMore(response.hasMore);
         } catch (err) {
            console.error("Load movers error:", err);
            setError(t("loadFailed"));
         } finally {
            setLoading(false);
         }
      };

      const timeoutId = setTimeout(() => {
         loadData();
      }, 300);

      return () => clearTimeout(timeoutId);
   }, [
      filters.search,
      filters.area,
      filters.serviceType,
      filters.sortBy,
      t,
      locale,
   ]);

   if (error) {
      return (
         <div className="flex flex-col items-center justify-center p-8">
            <div className="text-center">
               <p className="mb-4 text-gray-500">{error}</p>
               <button
                  onClick={() => loadMovers(true)}
                  className="bg-primary-blue-300 hover:bg-primary-blue-400 rounded-lg px-4 py-2 text-white"
               >
                  {t("retry")}
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="flex flex-col gap-6 lg:gap-12">
         {movers.map((mover) => (
            <DriverCard
               key={mover.id}
               mover={mover}
               onFavoriteChange={handleFavoriteChange}
            />
         ))}

         {hasMore && (
            <div ref={setLoadingRef} className="flex justify-center p-4">
               {loading && !isAppending ? (
                  // 초기 로딩 → 스켈레톤
                  <div className="flex w-full flex-col gap-6 lg:gap-12">
                     <SkeletonLayout
                        count={6}
                        SkeletonComponent={DriverCardSkeleton}
                     />
                  </div>
               ) : isAppending ? (
                  // 추가 로딩 → 텍스트
                  <span>기사님 정보를 가져오는 중...</span>
               ) : null}
            </div>
         )}

         {!hasMore && movers.length > 0 && (
            <div className="py-4 text-center">
               <p className="text-gray-500">
                  모든 기사님 정보 조회가 완료되었습니다.
               </p>
            </div>
         )}
      </div>
   );
});
