"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import chevronDownIcon from "@/assets/images/chevronDownIcon.svg"

interface DropdownOption {
  label: string;
  value: string;
}

const sortOptions: DropdownOption[] = [
  { label: "리뷰 많은순", value: "mostReviewed" },
  { label: "평점 높은순", value: "highRating" },
  { label: "경력 높은순", value: "highExperience" },
  { label: "확정 많은순", value: "mostBooked" },
];

export default function SortDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownOption>(sortOptions[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: DropdownOption) => {
    setSelected(option);
    setIsOpen(false);
    console.log("정렬 선택됨:", option);
  };

  // 외부 클릭 시 닫기
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[91px] h-[32px] lg:w-[114px] lg:h-[40px] rounded-lg text-12-regular lg:text-14-regular flex items-center justify-center"
      >
        {selected.label}
        <Image src={chevronDownIcon} alt="dropdownIcon" className="w-[20px] h-[20px]" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-[91px]  lg:w-[114px] bg-white border border-gray-100 rounded-lg shadow-md z-10"
        >
          {sortOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className="w-full h-[32px] lg:w-[114px] lg:h-[40px] px-3 flex items-center cursor-pointer hover:bg-gray-100 text-14-regular"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
