"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import chevronDownIcon from "@/assets/images/chevronDownIcon.svg";

interface DropdownOption {
   label: string;
   value: string;
}

interface SortDropdownProps {
   selected: DropdownOption;
   onSelect: (option: DropdownOption) => void;
   sortOptions: DropdownOption[];
}

export default function SortDropdown({
   selected,
   onSelect,
   sortOptions,
}: SortDropdownProps) {
   const [isOpen, setIsOpen] = useState(false);

   const dropdownRef = useRef<HTMLDivElement>(null);

   // const handleSelect = (option: DropdownOption) => {
   //   setSelected(option);
   //   setIsOpen(false);
   //   console.log("정렬 선택됨:", option);
   // };
   const handleSelect = (option: DropdownOption) => {
      onSelect(option); // 🔄 외부로 전달
      setIsOpen(false);
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
      <div
         ref={dropdownRef}
         className="relative inline-block text-left lg:pt-6 lg:pb-2"
      >
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-14-medium lg:text-16-medium flex h-8 w-24 items-center justify-center gap-1 rounded-lg lg:h-10 lg:w-28"
         >
            {selected.label}
            <Image
               src={chevronDownIcon}
               alt="dropdownIcon"
               className="h-5 w-5"
            />
         </button>

         {isOpen && (
            <div className="absolute right-0 z-10 mt-2 w-24 rounded-lg border border-gray-100 bg-white shadow-md lg:w-28">
               {sortOptions.map((option) => (
                  <div
                     key={option.value}
                     onClick={() => handleSelect(option)}
                     className="text-14-medium lg:text-16-medium hover:bg-hover-100 flex h-8 w-full cursor-pointer items-center px-3 lg:h-10"
                  >
                     {option.label}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
