"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import chervronDown from "@/assets/images/chevronDownIcon.svg";

interface Dropdown {
   dropdownName: string;
   setDropdownName: (name: string) => void;
}

export default function Dropdown({ dropdownName, setDropdownName }: Dropdown) {
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   // 드롭다운 외부 클릭 시 닫기
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            setIsDropdownOpen(false);
         }
      };

      if (isDropdownOpen) {
         document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [isDropdownOpen]);

   // 드롭다운 항목 선택 시 닫기
   const handleDropdownItemClick = (name: string) => {
      setDropdownName(name);
      setIsDropdownOpen(false);
   };

   return (
      <aside className="relative w-31.5 lg:w-47.5" ref={dropdownRef}>
         <div
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="border-line-100 bg-gray50 flex h-9 cursor-pointer items-center justify-between rounded-lg border px-3 py-1.5 lg:h-16 lg:rounded-2xl lg:px-6 lg:py-4"
         >
            <p className="text-14-medium lg:text-18-medium">{dropdownName}</p>
            <Image src={chervronDown} alt="카테고리" width={20} height={20} />
         </div>
         {isDropdownOpen && (
            <ul className="border-line-100 absolute w-full rounded-lg border bg-white">
               <li
                  onClick={() => handleDropdownItemClick("전체")}
                  className="text-14-medium lg:text-18-medium flex h-9 cursor-pointer items-center px-3.5 py-4 lg:h-16"
               >
                  전체
               </li>
               <li
                  onClick={() => handleDropdownItemClick("확정한 견적서")}
                  className="text-14-medium lg:text-18-medium flex h-9 cursor-pointer items-center px-3.5 py-4 lg:h-16"
               >
                  확정한 견적서
               </li>
            </ul>
         )}
      </aside>
   );
}
