"use client";

import { useState } from "react";
import DriverList from "./DriverList";
import SortDropdown from "./SortDropdown";
import FilterAreaServiceBox from "./FilterAreaServiceBox";
import SearchBar from "./SearchBar";
import { DropdownOption } from "@/lib/types/mover.types";
import FavoriteDriverList from "./FavoriteDriverList";

import {
  AREA_OPTIONS,
  SERVICE_OPTIONS,
  SORT_OPTIONS,
} from "@/constants/mover.constants";

const areaOptions = AREA_OPTIONS;
const serviceOptions = SERVICE_OPTIONS;
const sortOptions = SORT_OPTIONS;

export default function FindDriverLayout() {
  const [filters, setFilters] = useState({
    search: "",
    area: "all",
    serviceType: "all",
    sortBy: "mostReviewed",
  });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters({
      search: "",
      area: "all",
      serviceType: "all",
      sortBy: "mostReviewed",
    });
  };

  const handleSortSelect = (option: DropdownOption) => {
    handleFilterChange({ sortBy: option.value });
  };

  const currentSortOption = sortOptions.find(option => option.value === filters.sortBy) || sortOptions[0];

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

          <DriverList filters={filters} />
        </div>
      </div>
    </div>
  );
}