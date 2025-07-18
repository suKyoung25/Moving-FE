"use client";

import DriverList from "./DriverList";
import SortDropdown from "./SortDropdown";
import FilterAreaServiceBox from "./FilterAreaServiceBox";
import SearchBar from "./SearchBar";
import { DropdownOption } from "./Dropdown";
import FavoriteDriverList from "./FavoriteDriverList";
import { MoverProvider } from "@/context/MoverContext";

const areaOptions: DropdownOption[] = [
   { label: "전체", value: "all" },
   { label: "서울", value: "seoul" },
   { label: "인천", value: "incheon" },
   { label: "대전", value: "daejeon" },
   { label: "대구", value: "daegu" },
   { label: "광주", value: "gwangju" },
   { label: "부산", value: "busan" },
   { label: "울산", value: "ulsan" },
   { label: "세종", value: "sejong" },
   { label: "경기", value: "gyeonggi" },
   { label: "강원", value: "gangwon" },
   { label: "충북", value: "chungbuk" },
   { label: "충남", value: "chungnam" },
   { label: "전북", value: "jeonbuk" },
   { label: "전남", value: "jeonnam" },
   { label: "경북", value: "gyeongbuk" },
   { label: "경남", value: "gyeongnam" },
   { label: "제주", value: "jeju" },
];

const serviceOptions: DropdownOption[] = [
   { label: "전체", value: "all" },
   { label: "소형이사", value: "SMALL" },
   { label: "가정이사", value: "HOME" },
   { label: "사무실이사", value: "OFFICE" },
];

export default function FindDriverLayout() {
   const handleSelect = (type: string, option: DropdownOption) => {
      console.log(`${type} selected:`, option);
   };

   return (
      <MoverProvider>
         <div className="mx-auto flex min-h-screen min-w-full justify-center pt-6 pb-10 md:max-w-3xl lg:max-w-6xl">
            <div className="flex flex-col lg:flex-row lg:gap-32">
               {/* PC 사이즈 - 왼쪽 사이드바 */}
               <div className="hidden w-80 shrink-0 lg:block">
                  <FilterAreaServiceBox
                     areaOptions={areaOptions}
                     serviceOptions={serviceOptions}
                     onSelect={handleSelect}
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
                           onSelect={handleSelect}
                        />
                     </div>

                     <div className="ml-auto">
                        <SortDropdown />
                     </div>
                  </div>

                  <div className="relative mb-6">
                     <SearchBar />
                  </div>

                  <DriverList />
               </div>
            </div>
         </div>
      </MoverProvider>
   );
}
