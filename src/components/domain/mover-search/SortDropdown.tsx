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
}

const sortOptions: DropdownOption[] = [
  { label: "리뷰 많은순", value: "mostReviewed" },
  { label: "평점 높은순", value: "highRating" },
  { label: "경력 높은순", value: "highExperience" },
  { label: "확정 많은순", value: "mostBooked" },
];

export default function SortDropdown({ selected, onSelect }: SortDropdownProps) {
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left lg:pb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-24 h-8 lg:w-28 lg:h-10 rounded-lg text-12-semibold lg:text-14-semibold flex items-center justify-center gap-1"
      >
        {selected.label}
        <Image src={chevronDownIcon} alt="dropdownIcon" className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-24 lg:w-28 bg-white border border-gray-100 rounded-lg shadow-md z-10">
          {sortOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className="w-full h-8 lg:h-10 px-3 flex items-center cursor-pointer hover:bg-gray-100 text-12-medium lg:text-14-medium"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
