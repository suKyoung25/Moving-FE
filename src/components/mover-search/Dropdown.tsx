"use client";
import { useEffect, useRef, useState } from "react";
import chevronDownBlackIcon from "@/assets/images/chevronDownBlackIcon.svg";
import chevronDownBlueIcon from "@/assets/images/chevronDownBlueIcon.svg";
import Image from "next/image";
export interface DropdownOption {
   label: string;
   value: string;
}
interface DropdownProps {
   label: string;
   options: DropdownOption[];
   onSelect?: (option: DropdownOption) => void;
   multiColumn?: boolean;
   value?: string; // 외부에서 제어할 수 있는 value prop 추가
}

export default function Dropdown({
   label,
   options,
   onSelect,
   multiColumn,
   value,
}: DropdownProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [selected, setSelected] = useState(label);
   const dropdownRef = useRef<HTMLDivElement>(null);

   // value prop이 변경되면 선택된 값 업데이트
   useEffect(() => {
      if (value !== undefined) {
         const option = options.find((opt) => opt.value === value);
         if (option) {
            setSelected(option.label);
         }
      }
   }, [value, options]);

   const handleSelect = (option: DropdownOption) => {
      setSelected(option.label);
      setIsOpen(false);
      onSelect?.(option);
   };

   // 외부 클릭 시 닫기
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   return (
      <div ref={dropdownRef} className="relative">
         {/* 버튼 */}
         <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`flex items-center justify-between ${multiColumn ? "" : "w-auto lg:w-80"} text-14-medium lg:text-18-medium rounded-lg border px-3 py-2 text-left lg:rounded-2xl lg:px-4 ${
               isOpen
                  ? "border-primary-blue-300 text-primary-blue-300 bg-primary-blue-50"
                  : "border-gray-100 bg-white"
            } h-9 w-20 lg:h-15 lg:w-80`}
         >
            {selected}
            <Image
               src={isOpen ? chevronDownBlueIcon : chevronDownBlackIcon}
               alt="드롭다운"
               className="h-5 w-5"
            />
         </button>

         {/* 옵션 리스트 */}
         {isOpen && (
            <div
               className={`scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-gutter-stable absolute z-10 mt-2 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-md ${multiColumn ? "h-44 w-40 lg:h-80 lg:w-80" : ""} `}
            >
               {multiColumn ? (
                  <div className="grid grid-cols-2 divide-x divide-dotted divide-gray-200">
                     {options.map((option) => (
                        <div
                           key={option.value}
                           onClick={() => handleSelect(option)}
                           className="text-14-medium lg:text-18-medium flex h-9 cursor-pointer items-center justify-start px-2 hover:bg-gray-100 lg:h-15"
                        >
                           {option.label}
                        </div>
                     ))}
                  </div>
               ) : (
                  <div>
                     {options.map((option) => (
                        <div
                           key={option.value}
                           onClick={() => handleSelect(option)}
                           className="text-14-medium lg:text-18-medium flex h-9 w-22 cursor-pointer items-center justify-start px-3 hover:bg-gray-100 lg:h-15 lg:w-80"
                        >
                           {option.label}
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}
      </div>
   );
}
