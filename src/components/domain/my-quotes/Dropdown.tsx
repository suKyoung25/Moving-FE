"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import chervronDown from "@/assets/images/chevronDownIcon.svg";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

interface DropdownOption {
   label: string;
   value: string;
}
interface DropdownProps {
   selectedValue: string;
   setSelectedValue: (value: string) => void;
   options: DropdownOption[];
}

export default function Dropdown({
   selectedValue,
   setSelectedValue,
   options,
}: DropdownProps) {
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   // 드롭다운 외부 클릭 시 닫기
   useOutsideClick(dropdownRef, () => setIsDropdownOpen(false));

   // 드롭다운 항목 선택 시 닫기
   const handleDropdownItemClick = (value: string) => {
      setSelectedValue(value);
      setIsDropdownOpen(false);
   };

   const selectedLabel =
      options.find((opt) => opt.value === selectedValue)?.label || "";

   return (
      <aside className="relative w-31.5 lg:w-47.5" ref={dropdownRef}>
         <div
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="border-line-100 bg-gray50 flex h-9 cursor-pointer items-center justify-between rounded-lg border px-3 py-1.5 lg:h-16 lg:rounded-2xl lg:px-6 lg:py-4"
         >
            <p className="text-14-medium lg:text-18-medium">{selectedLabel}</p>
            <Image src={chervronDown} alt="카테고리" width={20} height={20} />
         </div>
         {isDropdownOpen && (
            <ul className="border-line-100 absolute w-full rounded-lg border bg-white">
               {options.map((opt) => (
                  <li
                     key={opt.value}
                     onClick={() => handleDropdownItemClick(opt.value)}
                     className="text-14-medium lg:text-18-medium flex h-9 cursor-pointer items-center px-3.5 py-4 lg:h-16"
                  >
                     {opt.label}
                  </li>
               ))}
            </ul>
         )}
      </aside>
   );
}
