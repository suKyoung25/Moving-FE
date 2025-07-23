"use client";

import DriverList from "./DriverList";
import SortDropdown from "./SortDropdown";
import FilterAreaServiceBox from "./FilterAreaServiceBox";
import SearchBar from "./SearchBar";
import { DropdownOption } from "@/lib/types/mover.types"
import FavoriteDriverList from "./FavoriteDriverList";
import { MoverProvider, useMover } from "@/context/mover";
import {
  AREA_OPTIONS,
  SERVICE_OPTIONS,
  SORT_OPTIONS,
} from "@/constants/mover.constants";

const areaOptions = AREA_OPTIONS;
const serviceOptions = SERVICE_OPTIONS;
const sortOptions = SORT_OPTIONS;

// ✅ Context를 사용하는 내부 컴포넌트
function FindDriverContent() {
   const { state, setFilters } = useMover();
   
   // Context의 현재 필터 상태에서 정렬 옵션 찾기
   const currentSortOption = sortOptions.find(option => option.value === state.filters.sortBy) || sortOptions[0];
  
   // 정렬 변경 핸들러
   const handleSortSelect = (option: DropdownOption) => {
      setFilters({ sortBy: option.value });
   };

   // 필터 변경 핸들러
   const handleFilterSelect = (type: string, option: DropdownOption) => {
      if (type === "area") {
         setFilters({ area: option.value });
      } else if (type === "serviceType") {
         setFilters({ serviceType: option.value });
      }
   };

   return (
      <div className="mx-auto flex min-h-screen min-w-full justify-center pt-6 pb-10 md:max-w-3xl lg:max-w-6xl">
         <div className="flex flex-col lg:flex-row lg:gap-32">
            {/* PC 사이즈 - 왼쪽 사이드바 */}
            <div className="hidden w-80 shrink-0 lg:block">
               <FilterAreaServiceBox
                  areaOptions={areaOptions}
                  serviceOptions={serviceOptions}
                  onSelect={handleFilterSelect}
               />
               <FavoriteDriverList />
            </div>

            {/* Content Section */}
            <div className="box-border w-80 flex-1 md:w-[36rem] lg:w-[60rem]">
               <div className="flex w-full flex-row justify-between">
                  {/* 모바일 & 중간 사이즈 - 필터 상단에 노출 */}
                  <div className="mb-4 block lg:hidden">
                     <FilterAreaServiceBox
                        areaOptions={areaOptions}
                        serviceOptions={serviceOptions}
                        onSelect={handleFilterSelect}
                     />
                  </div>

                  <div className="ml-auto">
                     {/* ✅ Context 상태와 연동된 정렬 드롭다운 */}
                     <SortDropdown 
                        selected={currentSortOption} 
                        onSelect={handleSortSelect} 
                     />
                  </div>
               </div>

               <div className="relative mb-6">
                  <SearchBar />
               </div>

               {/* ✅ DriverList는 Context에서 직접 상태를 가져옴 */}
               <DriverList />
            </div>
         </div>
      </div>
   );
}

// ✅ Provider로 감싼 메인 컴포넌트
export default function FindDriverLayout() {
   return (
      <MoverProvider>
         <FindDriverContent />
      </MoverProvider>
   );
}