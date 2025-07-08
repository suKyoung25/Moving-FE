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
          flex flex-row justify-between items-center
          w-[75px] lg:w-[328px] px-3 py-2 rounded-lg border text-14-regular text-left
          ${multiColumn ? '' : 'w-auto lg:w-[328px]'}
          ${isOpen
            ? 'border-primary-blue-300 text-primary-blue-300 bg-primary-blue-50'
            : 'border-gray-200  bg-white'}
        `}
      >
        {selected}
        <Image
          src={isOpen ? chevronDownBlueIcon : chevronDownBlackIcon}
          alt="드롭다운"
          className="w-[20px] h-[20px]"
        />
      </button>

      {/* 옵션 리스트 */}
      {isOpen && (
        <div
          className={`
            absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-md
            overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
            ${multiColumn ? 'w-[165px] h-[180px] lg:w-auto lg:h-[320px]' : ''}
          `}
        >
          {multiColumn ? (
            <div className="grid grid-cols-2 divide-x divide-dotted divide-gray-200 max-h-full">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="
                    cursor-pointer hover:bg-gray-100 text-14-regular
                    flex items-center justify-start
                    w-[75px] h-[36px] lg:w-[164px] lg:h-[64px] px-2
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
                    cursor-pointer hover:bg-gray-100 text-14-regular
                    flex items-center justify-start
                    w-[89px] h-[36px] lg:w-[328px] lg:h-[64px] px-3
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
