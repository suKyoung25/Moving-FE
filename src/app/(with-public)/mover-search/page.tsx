'use client';
import PageTitle from "@/components/layout/PageTitle";
import DriverList from './_components/DriverList';
import SortDropdown from './_components/SortDropdown';
import FilterAreaServiceBox from './_components/FilterAreaServiceBox';
import SearchBar from './_components/SearchBar';
import { DropdownOption } from './_components/Dropdown';
import FavoriteDriverList from "./_components/FavoriteDriverList";

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

//기사님 찾기
export default function FindDriverPage() {
    const handleSelect = (type: string, option: DropdownOption) => {
        console.log(`${type} selected:`, option);
      };
    return(
        <div>
            <PageTitle title="기사님 찾기"/>
            <div className="min-h-screen pt-6 pb-10 min-w-[375px] md:max-w-[744px] lg:max-w-[1400px] mx-auto">

              <div className="flex flex-col lg:flex-row lg:gap-[120px]">      

                {/* PC 사이즈 - 왼쪽 사이드바 */}
                <div className="hidden lg:block w-[328px] shrink-0">
                  <FilterAreaServiceBox
                    areaOptions={areaOptions}
                    serviceOptions={serviceOptions}
                    onSelect={handleSelect}
                  />
                  <FavoriteDriverList />
                </div>

                {/* Content Section */}
                <div className="flex-1 w-[327px] md:w-[600px] lg:w-[955px] box-border">
                  <div className="w-full flex flex-row justify-between">
                    
                      {/* 모바일 & 중간 사이즈 - 필터 상단에 노출 */}
                      <div className="block lg:hidden  mb-6">
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
        </div>
    )
}