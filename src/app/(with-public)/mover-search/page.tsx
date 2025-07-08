'use client';

import PageTitle from "@/components/layout/PageTitle";
import DriverList from './_components/DriverList';
import SortDropdown from './_components/SortDropdown';
import FilterAreaServiceBox from './_components/FilterAreaServiceBox';
import SearchBar from './_components/SearchBar';
import { DropdownOption } from './_components/Dropdown';
import FavoriteDriverList from "./_components/FavoriteDriverList";

const areaOptions: DropdownOption[] = [/* 생략 */];
const serviceOptions: DropdownOption[] = [/* 생략 */];

export default function FindDriverPage() {
  const handleSelect = (type: string, option: DropdownOption) => {
    console.log(`${type} selected:`, option);
  };

  return (
    <div>
      <PageTitle title="기사님 찾기" />
      <div className="min-h-screen pt-6 pb-10 min-w-full md:max-w-3xl lg:max-w-6xl mx-auto">
        <div className="flex flex-col items-center lg:flex-row lg:gap-32">
          {/* PC 사이즈 - 왼쪽 사이드바 */}
          <div className="hidden lg:block w-80 shrink-0">
            <FilterAreaServiceBox
              areaOptions={areaOptions}
              serviceOptions={serviceOptions}
              onSelect={handleSelect}
            />
            <FavoriteDriverList />
          </div>

          {/* Content Section */}
          <div className="flex-1 w-80 md:w-[36rem] lg:w-full box-border">
            <div className="w-full flex flex-row justify-between">
              {/* 모바일 & 중간 사이즈 - 필터 상단에 노출 */}
              <div className="block lg:hidden mb-6">
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
  );
}
