"use client";

import { useState, useCallback, useMemo, memo, lazy, Suspense } from "react";
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

// ✅ 스켈레톤 컴포넌트들을 여기서 정의
const FavoriteItemSkeleton = memo(function FavoriteItemSkeleton() {
   return (
      <div className="animate-pulse rounded-lg border border-gray-100 bg-white p-3">
         <div className="mb-3 space-y-2">
            <div className="h-4 w-full rounded bg-gray-200"></div>
         </div>
         <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
               <div className="h-4 w-1/2 rounded bg-gray-200"></div>
               <div className="flex gap-4">
                  <div className="h-3 w-12 rounded bg-gray-200"></div>
               </div>
            </div>
            <div className="h-6 w-6 rounded bg-gray-200"></div>
         </div>
      </div>
   );
});

const FavoriteLoadingSkeleton = memo(function FavoriteLoadingSkeleton() {
   return (
      <div className="mt-8 flex flex-col gap-4 rounded-lg">
         <div className="border-b border-b-gray-100 pb-5">
            <div className="h-6 w-32 rounded bg-gray-200"></div>
         </div>
         <div className="space-y-4">
            <FavoriteItemSkeleton />
            <FavoriteItemSkeleton />
            <FavoriteItemSkeleton />
         </div>
      </div>
   );
});

// lazy loading용 간단한 스켈레톤
const FavoriteListSkeleton = memo(function FavoriteListSkeleton() {
   return (
      <div className="mt-8 flex animate-pulse flex-col gap-4 rounded-lg">
         <div className="h-6 w-32 rounded bg-gray-200"></div>
         <div className="h-20 rounded-lg bg-gray-100"></div>
         <div className="h-20 rounded-lg bg-gray-100"></div>
      </div>
   );
});

export default memo(function MoverSearchLayout() {
   const t = useTranslations("MoverSearch");

   // 번역 옵션을 한 번만 계산하도록 최적화
   const translatedOptions = useMemo(() => ({
      area: AREA_OPTIONS.map((option) => ({
         ...option,
         label: t(`areas.${option.value}`),
      })),
      service: SERVICE_OPTIONS.map((option) => ({
         ...option,
         label: t(`services.${option.value}`),
      })),
      sort: SORT_OPTIONS.map((option) => ({
         ...option,
         label: t(`sorts.${option.value}`),
      })),
   }), [t]);

   const [filters, setFilters] = useState({
      search: "",
      area: "all",
      serviceType: "all",
      sortBy: "mostReviewed",
   });

   // refresh key를 통합하여 관리
   const [refreshKeys, setRefreshKeys] = useState({
      favorite: 0,
      driverList: 0,
   });

   const handleFilterChange = useCallback(
      (newFilters: Partial<typeof filters>) => {
         setFilters((prev) => ({ ...prev, ...newFilters }));
      },
      [],
   );

   const handleDriverListFavoriteChange = useCallback(() => {
      setRefreshKeys((prev) => ({ 
         ...prev, 
         favorite: prev.favorite + 1 
      }));
   }, []);

   const handleFavoriteListChange = useCallback(() => {
      setRefreshKeys((prev) => ({ 
         ...prev, 
         driverList: prev.driverList + 1 
      }));
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
         translatedOptions.sort.find(
            (option) => option.value === filters.sortBy,
         ) || translatedOptions.sort[0],
      [filters.sortBy, translatedOptions.sort],
   );

   return (
      <div className="mt-4">
         {/* 데스크탑 레이아웃 */}
         <div className="mt-6 hidden gap-20 lg:flex">
            <aside className="w-80 shrink-0">
               <div className="flex h-[calc(100vh-12.5rem)] flex-col overflow-hidden">
                  <div>
                     <FilterAreaServiceBox
                        areaOptions={translatedOptions.area}
                        serviceOptions={translatedOptions.service}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                        currentFilters={filters}
                     />
                  </div>

                  <div className="scrollbar-hide mt-4 flex-1 overflow-y-auto">
                     <Suspense fallback={<FavoriteListSkeleton />}>
                        <FavoriteDriverList
                           key={`desktop-${refreshKeys.favorite}`}
                           refreshKey={refreshKeys.favorite}
                           onFavoriteChange={handleFavoriteListChange}
                           LoadingSkeleton={FavoriteLoadingSkeleton}
                        />
                     </Suspense>
                  </div>
               </div>
            </aside>

            <div className="flex h-[calc(100vh-13rem)] w-full flex-col gap-6 overflow-hidden">
               <div>
                  <SearchBar
                     onSearchChange={(search) =>
                        handleFilterChange({ search })
                     }
                     initialValue={filters.search}
                  />
                  <SortDropdown
                     selected={currentSortOption}
                     onSelect={handleSortSelect}
                     sortOptions={translatedOptions.sort}
                  />
               </div>

               <div className="scrollbar-hide flex-1 overflow-y-auto">
                  <DriverList
                     filters={filters}
                     onFavoriteChange={handleDriverListFavoriteChange}
                     refreshKey={refreshKeys.driverList}
                  />
               </div>
            </div>
         </div>

         {/* 모바일 레이아웃 */}
         <div className="flex h-[calc(100vh-6.25rem)] flex-col lg:hidden">
            <div className="sticky top-0 z-10 bg-white">
               <FilterAreaServiceBox
                  areaOptions={translatedOptions.area}
                  serviceOptions={translatedOptions.service}
                  onFilterChange={handleFilterChange}
                  onReset={handleReset}
                  currentFilters={filters}
               />

               <div>
                  <SearchBar
                     onSearchChange={(search) =>
                        handleFilterChange({ search })
                     }
                     initialValue={filters.search}
                  />
                  <div className="my-4 flex justify-end">
                     <SortDropdown
                        selected={currentSortOption}
                        onSelect={handleSortSelect}
                        sortOptions={translatedOptions.sort}
                     />
                  </div>
               </div>
            </div>

            <section className="scrollbar-hide flex-1 overflow-y-auto">
               <DriverList
                  filters={filters}
                  onFavoriteChange={handleDriverListFavoriteChange}
                  refreshKey={refreshKeys.driverList}
               />
            </section>
         </div>
      </div>
   );
});