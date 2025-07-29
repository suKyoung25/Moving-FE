"use client";

import Dropdown from "./Dropdown";
import { DropdownOption } from "@/lib/types/mover.types";

interface FilterAreaServiceBoxProps {
  areaOptions: DropdownOption[];
  serviceOptions: DropdownOption[];
  onFilterChange: (filters: { area?: string; serviceType?: string }) => void;
  onReset: () => void;
  currentFilters: {
    area: string;
    serviceType: string;
  };
}

export default function FilterAreaServiceBox({
  areaOptions,
  serviceOptions,
  onFilterChange,
  onReset,
  currentFilters,
}: FilterAreaServiceBoxProps) {
  const handleAreaSelect = (option: DropdownOption) => {
    onFilterChange({ area: option.value });
  };

  const handleServiceSelect = (option: DropdownOption) => {
    onFilterChange({ serviceType: option.value });
  };

  return (
    <div className="mb-1 flex w-full flex-row lg:w-80 lg:flex-col">
      <div className="mb-6 hidden flex-row items-center justify-between border-b border-b-gray-100 px-3 pb-4 lg:flex">
        <h2 className="text-20-medium font-semibold">필터</h2>
        <p
          className="cursor-pointer text-gray-300 transition-colors hover:text-gray-500"
          onClick={onReset}
        >
          초기화
        </p>
      </div>

      <div className="mr-2 lg:mr-0">
        <h3 className="mb-4 hidden text-lg font-semibold lg:block">
          지역을 선택해주세요
        </h3>
        <Dropdown
          label="전체"
          options={areaOptions}
          onSelect={handleAreaSelect}
          multiColumn={true}
          value={currentFilters.area}
        />
      </div>

      <div className="lg:mt-6">
        <h3 className="mb-4 hidden text-lg font-semibold lg:block">
          어떤 서비스가 필요하세요?
        </h3>
        <Dropdown
          label="전체"
          options={serviceOptions}
          onSelect={handleServiceSelect}
          multiColumn={false}
          value={currentFilters.serviceType}
        />
      </div>
    </div>
  );
}
