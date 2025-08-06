"use client";

import { useState, useCallback, useMemo, memo, lazy, Suspense } from "react";
import DriverList from "./DriverList";
import SortDropdown from "./SortDropdown";
import FilterAreaServiceBox from "./FilterAreaServiceBox";
import SearchBar from "./SearchBar";
import { DropdownOption } from "@/lib/types/mover.types";

// FavoriteDriverList를 lazy 로딩으로 최적화
const FavoriteDriverList = lazy(() => import("./FavoriteDriverList"));

import {
   AREA_OPTIONS,
   SERVICE_OPTIONS,
   SORT_OPTIONS,
} from "@/constants/mover.constants";

// 상수들을 컴포넌트 외부로 이동 (매번 새로 생성되는 것 방지)
const areaOptions = AREA_OPTIONS;
const serviceOptions = SERVICE_OPTIONS;
const sortOptions = SORT_OPTIONS;

// FavoriteDriverList 로딩 스켈레톤
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
   const [filters, setFilters] = useState({
      search: "",
      area: "all",
      serviceType: "all",
      sortBy: "mostReviewed",
   });

   //  양방향 동기화를 위한 refreshKey 관리
   const [favoriteRefreshKey, setFavoriteRefreshKey] = useState(0);
   const [driverListRefreshKey, setDriverListRefreshKey] = useState(0);

   // 함수들을 useCallback으로 최적화
   const handleFilterChange = useCallback(
      (newFilters: Partial<typeof filters>) => {
         setFilters((prev) => ({ ...prev, ...newFilters }));
      },
      [],
   );

   //  DriverList → FavoriteDriverList 동기화
   const handleDriverListFavoriteChange = useCallback(() => {
      setFavoriteRefreshKey((prev) => prev + 1);
   }, []);

   //  FavoriteDriverList → DriverList 동기화
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

   // 현재 정렬 옵션을 메모이제이션
   const currentSortOption = useMemo(
      () =>
         sortOptions.find((option) => option.value === filters.sortBy) ||
         sortOptions[0],
      [filters.sortBy],
   );

   return (
      <div className="mx-auto flex min-h-screen min-w-full justify-center pt-6 pb-10 md:max-w-3xl lg:max-w-6xl">
         <div className="flex flex-col lg:flex-row lg:gap-32">
            {/* PC 사이즈 - 왼쪽 사이드바 */}
            <div className="hidden w-80 shrink-0 lg:block">
               <FilterAreaServiceBox
                  areaOptions={areaOptions}
                  serviceOptions={serviceOptions}
                  onFilterChange={handleFilterChange}
                  onReset={handleReset}
                  currentFilters={filters}
               />

               {/* 동기화 + Lazy 로딩 적용 */}
               <Suspense fallback={<FavoriteListSkeleton />}>
                  <FavoriteDriverList
                     key={favoriteRefreshKey}
                     onFavoriteChange={handleFavoriteListChange}
                  />
               </Suspense>
            </div>

            {/* Content Section */}
            <div className="box-border w-80 flex-1 md:w-[36rem] lg:w-[60rem]">
               <div className="flex w-full flex-row justify-between">
                  {/* 모바일 & 중간 사이즈 - 필터 상단에 노출 */}
                  <div className="mb-4 block lg:hidden">
                     <FilterAreaServiceBox
                        areaOptions={areaOptions}
                        serviceOptions={serviceOptions}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                        currentFilters={filters}
                     />
                  </div>

                  <div className="ml-auto">
                     <SortDropdown
                        selected={currentSortOption}
                        onSelect={handleSortSelect}
                     />
                  </div>
               </div>

               <div className="relative mb-6">
                  <SearchBar
                     onSearchChange={(search) => handleFilterChange({ search })}
                     initialValue={filters.search}
                  />
               </div>

               {/*  양방향 동기화  */}
               <DriverList
                  filters={filters}
                  onFavoriteChange={handleDriverListFavoriteChange}
                  refreshKey={driverListRefreshKey}
               />
            </div>
         </div>
      </div>
   );
});
