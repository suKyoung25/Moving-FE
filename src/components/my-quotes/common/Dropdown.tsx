"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import chervronDown from "@/assets/images/chevronDownIcon.svg";

interface Dropdown {
  dropdownName: string;
  setDropdownName: (nmae: string) => void;
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
    <aside className="w-31.5 relative lg:w-47.5" ref={dropdownRef}>
      <div
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="flex items-center justify-between h-9 px-3 py-1.5 border border-line-100 rounded-lg bg-gray50 cursor-pointer lg:h-16 lg:px-6 lg:py-4 lg:rounded-2xl"
      >
        <p className="text-14-medium lg:text-18-medium">{dropdownName}</p>
        <Image src={chervronDown} alt="카테고리" width={20} height={20} />
      </div>
      {isDropdownOpen && (
        <ul className="bg-white rounded-lg border border-line-100 w-full absolute">
          <li
            onClick={() => handleDropdownItemClick("전체")}
            className="h-9 px-3.5 py-4 text-14-medium flex items-center cursor-pointer lg:h-16 lg:text-18-medium"
          >
            전체
          </li>
          <li
            onClick={() => handleDropdownItemClick("확정한 견적서")}
            className="h-9 px-3.5 py-4 text-14-medium flex items-center cursor-pointer lg:h-16 lg:text-18-medium"
          >
            확정한 견적서
          </li>
        </ul>
      )}
    </aside>
  );
}
