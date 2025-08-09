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

const FavoriteDriverList = lazy(() => import("./FavoriteDriverList"));

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

   // 번역된 옵션들을 메모이제이션
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

   // DriverList에서 찜 상태가 변경되었을 때 호출되는 핸들러
   const handleDriverListFavoriteChange = useCallback(
      (moverId: string, isFavorite: boolean, favoriteCount: number) => {
         console.log("DriverList favorite change:", {
            moverId,
            isFavorite,
            favoriteCount,
         });

         // FavoriteDriverList를 새로고침하도록 키 업데이트
         setFavoriteRefreshKey((prev) => prev + 1);
      },
      [],
   );

   // FavoriteDriverList에서 찜 상태가 변경되었을 때 호출되는 핸들러
   const handleFavoriteListChange = useCallback(
      (moverId: string, isFavorite: boolean, favoriteCount: number) => {
         console.log("FavoriteDriverList favorite change:", {
            moverId,
            isFavorite,
            favoriteCount,
         });

         // DriverList를 새로고침하도록 키 업데이트
         setDriverListRefreshKey((prev) => prev + 1);
      },
      [],
   );

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

   // 현재 선택된 정렬 옵션 찾기
   const currentSortOption = useMemo(
      () =>
         translatedSortOptions.find(
            (option) => option.value === filters.sortBy,
         ) || translatedSortOptions[0],
      [filters.sortBy, translatedSortOptions],
   );

   return (
      <div className="mx-auto flex min-h-screen min-w-full justify-center pt-6 pb-10 md:max-w-3xl lg:max-w-6xl">
         <div className="flex flex-col lg:flex-row lg:gap-32">
            <div className="hidden w-80 shrink-0 lg:block">
               <FilterAreaServiceBox
                  areaOptions={translatedAreaOptions}
                  serviceOptions={translatedServiceOptions}
                  onFilterChange={handleFilterChange}
                  onReset={handleReset}
                  currentFilters={filters}
               />

               <Suspense fallback={<FavoriteListSkeleton />}>
                  <FavoriteDriverList
                     key={favoriteRefreshKey}
                     refreshKey={favoriteRefreshKey} // refreshKey prop 추가
                     onFavoriteChange={handleFavoriteListChange}
                  />
               </Suspense>
            </div>

            <div className="box-border w-80 flex-1 md:w-[36rem] lg:w-[60rem]">
               <div className="flex w-full flex-row justify-between">
                  <div className="mb-4 block lg:hidden">
                     <FilterAreaServiceBox
                        areaOptions={translatedAreaOptions}
                        serviceOptions={translatedServiceOptions}
                        onFilterChange={handleFilterChange}
                        onReset={handleReset}
                        currentFilters={filters}
                     />
                  </div>

                  <div className="ml-auto">
                     <SortDropdown
                        selected={currentSortOption}
                        onSelect={handleSortSelect}
                        sortOptions={translatedSortOptions}
                     />
                  </div>
               </div>

               <div className="relative mb-6">
                  <SearchBar
                     onSearchChange={(search) => handleFilterChange({ search })}
                     initialValue={filters.search}
                  />
               </div>

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
