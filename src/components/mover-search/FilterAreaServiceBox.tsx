"use client";

import { useMover } from "@/context/MoverContext";
import Dropdown, { DropdownOption } from "./Dropdown";

interface FilterAreaServiceBoxProps {
   areaOptions: DropdownOption[];
   serviceOptions: DropdownOption[];
   onSelect: (type: string, option: DropdownOption) => void;
}

export default function FilterAreaServiceBox({
   areaOptions,
   serviceOptions,
   onSelect,
}: FilterAreaServiceBoxProps) {
   const { state, setFilters, resetFilters } = useMover();

   const handleAreaSelect = (option: DropdownOption) => {
      setFilters({ area: option.value });
      onSelect("area", option);
   };

   const handleServiceSelect = (option: DropdownOption) => {
      setFilters({ serviceType: option.value });
      onSelect("serviceType", option);
   };

   const handleReset = () => {
      resetFilters();
   };

   return (
      <div className="mb-1 flex w-full flex-row lg:w-80 lg:flex-col">
         <div className="mb-6 hidden flex-row items-center justify-between border-b border-b-gray-100 px-3 pb-4 lg:flex">
            <h2 className="text-20-medium font-semibold">필터</h2>
            <p
               className="cursor-pointer text-gray-300 transition-colors hover:text-gray-500"
               onClick={handleReset}
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
               value={state.filters.area}
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
               value={state.filters.serviceType}
            />
         </div>
      </div>
   );
}
