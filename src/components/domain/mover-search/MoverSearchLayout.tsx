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

// ✅ 전역 QueryClient 사용하므로 별도 Provider 불필요
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