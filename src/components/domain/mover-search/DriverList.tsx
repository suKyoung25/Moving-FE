"use client";

import { useState, useEffect, useCallback, memo, useRef } from "react";
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
import MoverSearchSpinner from "./MoverSearchSpinner";

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
   const [isAppending, setIsAppending] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [hasMore, setHasMore] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);

   // ✅ 무한 루프 방지를 위한 ref 사용
   const isLoadingRef = useRef(false);
   const refreshTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

   const buildParams = useCallback(
      (page: number) => {
         let area = filters.area !== "all" ? filters.area : undefined;
         if (area && areaMapping[area]) {
            area = areaMapping[area][0];
         }

         return {
            page,
            limit: 10,
            search: filters.search || undefined,
            area,
            serviceType:
               filters.serviceType !== "all" ? filters.serviceType : undefined,
            sortBy: filters.sortBy,
         } as GetMoversParams;
      },
      [filters],
   );

   const loadMovers = useCallback(
      async (reset = false) => {
         if (isLoadingRef.current) return;

         try {
            isLoadingRef.current = true;
            setError(null);

            if (reset) {
               setLoading(true);
               setIsAppending(false);
            } else {
               setIsAppending(true);
            }

            const targetPage = reset ? 1 : currentPage;
            const params = buildParams(targetPage);

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
            isLoadingRef.current = false;
         }
      },
      [currentPage, buildParams, t, locale],
   );

   const loadMore = useCallback(() => {
      if (!hasMore || loading || isAppending || isLoadingRef.current) return;
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

   // ✅ refreshKey 변경 시에만 즐겨찾기 상태 새로고침
   useEffect(() => {
      if (!refreshKey || refreshKey <= 0) return;

      const refreshFavoriteStates = async () => {
         try {
            // ✅ 현재 movers 상태를 함수 내부에서 참조
            setMovers((currentMovers) => {
               if (currentMovers.length === 0) return currentMovers;

               // 비동기 작업을 별도로 실행
               (async () => {
                  try {
                     const params = buildParams(1);
                     params.limit = Math.max(currentMovers.length, 10);

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
               })();

               return currentMovers;
            });
         } catch (err) {
            console.error("찜 상태 새로고침 실패:", err);
         }
      };

      // ✅ 디바운스 적용
      if (refreshTimeoutRef.current) {
         clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = setTimeout(() => {
         refreshFavoriteStates();
      }, 300);

      return () => {
         if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
         }
      };
   }, [refreshKey, buildParams, locale]); // ✅ 필요한 의존성만 포함

   // ✅ 필터 변경 시 초기 데이터 로드
   useEffect(() => {
      setCurrentPage(1);
      setHasMore(true);

      // ✅ 디바운스 적용
      const timeoutId = setTimeout(() => {
         // loadMovers를 직접 호출하지 않고 내부 로직 실행
         if (isLoadingRef.current) return;

         isLoadingRef.current = true;
         setError(null);
         setLoading(true);
         setIsAppending(false);

         const params = buildParams(1);
         const hasToken = Boolean(tokenSettings.get());

         getMovers(params, hasToken, locale)
            .then((response) => {
               setMovers(response.movers);
               setCurrentPage(2);
               setHasMore(response.hasMore);
            })
            .catch((err) => {
               console.error("Load movers error:", err);
               setError(t("loadFailed"));
            })
            .finally(() => {
               setLoading(false);
               setIsAppending(false);
               isLoadingRef.current = false;
            });
      }, 300);

      return () => {
         clearTimeout(timeoutId);
         if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
         }
      };
   }, [
      filters.search,
      filters.area,
      filters.serviceType,
      filters.sortBy,
      buildParams,
      locale,
      t,
   ]);

   // ✅ 컴포넌트 언마운트 시 정리
   useEffect(() => {
      return () => {
         if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
         }
         isLoadingRef.current = false;
      };
   }, []);

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
                  <div className="flex w-full flex-col gap-6 lg:gap-12">
                     <SkeletonLayout
                        count={6}
                        SkeletonComponent={DriverCardSkeleton}
                     />
                  </div>
               ) : isAppending ? (
                  <div></div>
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
