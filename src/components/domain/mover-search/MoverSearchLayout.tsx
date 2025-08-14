"use client";

import { useState, useCallback, useMemo, memo, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DriverList from "./DriverList";
import SortDropdown from "./SortDropdown";
import FilterAreaServiceBox from "./FilterAreaServiceBox";
import SearchBar from "./SearchBar";
import { DropdownOption } from "@/lib/types/mover.types";
import {
   AREA_OPTIONS,
   SERVICE_OPTIONS,
   SORT_OPTIONS,
} from "@/constants/mover.constants";
import { useTranslations } from "next-intl";

const FavoriteDriverList = lazy(() => import("./FavoriteDriverList").then(module => ({ default: module.default })));

// React Query Client 설정
const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: 5 * 60 * 1000, // 5분
         gcTime: 10 * 60 * 1000, // 10분
         retry: (failureCount, error) => {
            // 인증 관련 에러는 재시도하지 않음
            if (error instanceof Error && (
               error.message.includes("401") || 
               error.message.includes("로그인") ||
               error.message.includes("인증")
            )) {
               return false;
            }
            return failureCount < 3;
         },
         retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
         retry: 1,
         retryDelay: 1000,
      },
   },
});

// 스켈레톤 컴포넌트
const FavoriteListSkeleton = memo(function FavoriteListSkeleton() {
   return (
      <div className="mt-8 flex animate-pulse flex-col gap-4 rounded-lg">
         <div className="h-6 w-32 rounded bg-gray-200"></div>
         <div className="h-20 rounded-lg bg-gray-100"></div>
         <div className="h-20 rounded-lg bg-gray-100"></div>
      </div>
   );
});

// 메인 레이아웃 컴포넌트
const MoverSearchLayoutContent = memo(function MoverSearchLayoutContent() {
   const t = useTranslations("MoverSearch");

   // 번역 옵션
   const translatedAreaOptions = useMemo(
      () =>
         AREA_OPTIONS.map((option) => ({
            ...option,
            label: t(`areas.${option.value}`),
         })),
      [t],
   );

   const translatedServiceOptions = useMemo(
      () =>
         SERVICE_OPTIONS.map((option) => ({
            ...option,
            label: t(`services.${option.value}`),
         })),
      [t],
   );

   const translatedSortOptions = useMemo(
      () =>
         SORT_OPTIONS.map((option) => ({
            ...option,
            label: t(`sorts.${option.value}`),
         })),
      [t],
   );

   const [filters, setFilters] = useState({
      search: "",
      area: "all",
      serviceType: "all",
      sortBy: "mostReviewed",
   });

   const [favoriteRefreshKey, setFavoriteRefreshKey] = useState(0);
   const [driverListRefreshKey, setDriverListRefreshKey] = useState(0);

   const handleFilterChange = useCallback(
      (newFilters: Partial<typeof filters>) => {
         setFilters((prev) => ({ ...prev, ...newFilters }));
      },
      [],
   );

   // ✅ 검색 핸들러를 별도로 메모이제이션
   const handleSearchChange = useCallback(
      (search: string) => {
         handleFilterChange({ search });
      },
      [handleFilterChange],
   );

   const handleDriverListFavoriteChange = useCallback(() => {
      setFavoriteRefreshKey((prev) => prev + 1);
   }, []);

   const handleFavoriteListChange = useCallback(() => {
      setDriverListRefreshKey((prev) => prev + 1);
   }, []);

   const handleReset = useCallback(() => {
      setFilters({
         search: "",
         area: "all",
         serviceType: "all",
         sortBy: "mostReviewed",
      });
   }, []);

   const handleSortSelect = useCallback(
      (option: DropdownOption) => {
         handleFilterChange({ sortBy: option.value });
      },
      [handleFilterChange],
   );

   const currentSortOption = useMemo(
      () =>
         translatedSortOptions.find(
            (option) => option.value === filters.sortBy,
         ) || translatedSortOptions[0],
      [filters.sortBy, translatedSortOptions],
   );

   return (
      <div className="mt-4">
         {/* 데스크탑 레이아웃: 필터 고정(좌), 리스트 스크롤(우) */}
         <div className="mt-6 hidden gap-20 lg:flex">
            {/* 좌측 사이드(필터 + 즐겨찾기) */}
            <aside className="w-80 shrink-0">
               <div className="flex h-[calc(100vh-12.5rem)] flex-col overflow-hidden">
                  <div>
                     <FilterAreaServiceBox
                        areaOptions={translatedAreaOptions}
                        serviceOptions={translatedServiceOptions}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                        currentFilters={filters}
                     />
                  </div>

                  {/* 즐겨찾기 목록 - 별도 스크롤 영역 */}
                  <div className="scrollbar-hide mt-4 flex-1 overflow-y-auto">
                     <Suspense fallback={<FavoriteListSkeleton />}>
                        <FavoriteDriverList
                           key={favoriteRefreshKey}
                           refreshKey={favoriteRefreshKey}
                           onFavoriteChange={handleFavoriteListChange}
                        />
                     </Suspense>
                  </div>
               </div>
            </aside>

            {/* 우측 컨텐츠(검색/정렬 상단 고정 + 목록만 스크롤) */}
            <div className="flex h-[calc(100vh-13rem)] w-full flex-col gap-6 overflow-hidden">
               <div>
                  <div>
                     <SearchBar
                        onSearchChange={(search) =>
                           handleFilterChange({ search })
                        }
                        initialValue={filters.search}
                     />
                  </div>
                  <SortDropdown
                     selected={currentSortOption}
                     onSelect={handleSortSelect}
                     sortOptions={translatedSortOptions}
                  />
               </div>

               <div className="scrollbar-hide flex-1 overflow-y-auto">
                  <DriverList
                     filters={filters}
                     onFavoriteChange={handleDriverListFavoriteChange}
                     refreshKey={driverListRefreshKey}
                  />
               </div>
            </div>
         </div>

         {/* 태블릿 + 모바일 레이아웃 */}
         <div className="flex h-[calc(100vh-6.25rem)] flex-col lg:hidden">
            <div className="sticky top-0 z-10 bg-white">
               <FilterAreaServiceBox
                  areaOptions={translatedAreaOptions}
                  serviceOptions={translatedServiceOptions}
                  onFilterChange={handleFilterChange}
                  onReset={handleReset}
                  currentFilters={filters}
               />

               <div className="">
                  <div>
                     <SearchBar
                        onSearchChange={(search) =>
                           handleFilterChange({ search })
                        }
                        initialValue={filters.search}
                     />
                  </div>
                  <div className="my-4 flex justify-end">
                     <SortDropdown
                        selected={currentSortOption}
                        onSelect={handleSortSelect}
                        sortOptions={translatedSortOptions}
                     />
                  </div>
               </div>
            </div>

            <section className="scrollbar-hide flex-1 overflow-y-auto">
               <DriverList
                  filters={filters}
                  onFavoriteChange={handleDriverListFavoriteChange}
                  refreshKey={driverListRefreshKey}
               />
            </section>

            {/* 모바일에서는 즐겨찾기 숨김 (또는 별도 처리) */}
            <div className="hidden lg:block">
               <Suspense fallback={<FavoriteListSkeleton />}>
                  <FavoriteDriverList
                     key={`m-${favoriteRefreshKey}`}
                     refreshKey={favoriteRefreshKey}
                     onFavoriteChange={handleFavoriteListChange}
                  />
               </Suspense>
            </div>
         </div>
      </div>
   );
});

// QueryClient Provider로 감싼 메인 컴포넌트
export default memo(function MoverSearchLayout() {
   return (
      <QueryClientProvider client={queryClient}>
         <MoverSearchLayoutContent />
         {/* DevTools는 별도 설치 후 사용 가능 */}
      </QueryClientProvider>
   );
});