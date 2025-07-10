'use client';

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
}

export default function Dropdown({ label, options, onSelect, multiColumn }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: DropdownOption) => {
    setSelected(option.label);
    setIsOpen(false);
    onSelect?.(option);
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
    <div ref={dropdownRef} className="relative">
      {/* 버튼 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex justify-between items-center
          ${multiColumn ? '' : 'w-auto lg:w-80'}
          px-3 lg:px-4 py-2 rounded-lg lg:rounded-2xl border text-14-medium lg:text-18-medium text-left
          ${isOpen
            ? 'border-primary-blue-300 text-primary-blue-300 bg-primary-blue-50'
            : 'border-gray-100 bg-white'}
          w-20 lg:w-80 h-9 lg:h-15
        `}
      >
        {selected}
        <Image
          src={isOpen ? chevronDownBlueIcon : chevronDownBlackIcon}
          alt="드롭다운"
          className="w-5 h-5"
        />
      </button>

      {/* 옵션 리스트 */}
      {isOpen && (
        <div
          className={`
            absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-md
            overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-gutter-stable
            ${multiColumn ? 'w-40 h-44 lg:w-80 lg:h-80' : ''}
          `}
        >
          {multiColumn ? (
            <div className="grid grid-cols-2 divide-x divide-dotted divide-gray-200">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="
                    cursor-pointer hover:bg-gray-100 text-14-medium lg:text-18-medium
                    flex items-center justify-start
                    h-9 lg:h-15 px-2
                  "
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
                  className="
                    cursor-pointer hover:bg-gray-100 text-14-medium lg:text-18-medium
                    flex items-center justify-start
                    w-22 h-9 lg:w-80 lg:h-15 px-3
                  "
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
