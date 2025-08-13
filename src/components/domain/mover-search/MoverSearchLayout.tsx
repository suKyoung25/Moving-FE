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

// const FavoriteListSkeleton = memo(function FavoriteListSkeleton() {
//    return (
//       <div className="mt-8 flex animate-pulse flex-col gap-4 rounded-lg">
//          <div className="h-6 w-32 rounded bg-gray-200"></div>
//          <div className="h-20 rounded-lg bg-gray-100"></div>
//          <div className="h-20 rounded-lg bg-gray-100"></div>
//       </div>
//    );
// });

export default memo(function MoverSearchLayout() {
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
            {/* 좌측 사이드(필터 + 즐겨찾기). 필요시 자체 스크롤을 막고 고정 느낌 유지 */}
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

                  {/* 즐겨찾기 목록은 길어질 수 있으니 별도 스크롤 영역 부여(선택) */}
                  <div className="scrollbar-hide mt-4 flex-1 overflow-y-auto">
                     <Suspense fallback={<div>스켈레톤</div>}>
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

         {/* 태블릿 + 모바일 레이아웃: 상단 컨트롤 sticky, 아래 리스트 스크롤 */}
         <div className="flex h-[calc(100vh-6.25rem)] flex-col lg:hidden">
            <div className="sticky top-0 z-10 bg-white">
               {/* 필터 박스(모바일에선 접힌 UI라면 컴포넌트 내부에서 처리) */}
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

            {/* 즐겨찾기: 모바일에선 아래에 배치하거나 별도 화면/아코디언으로도 가능 */}
            <div className="hidden lg:block">
               <Suspense fallback={<div>찜한 기사님 가져오는 중...</div>}>
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
