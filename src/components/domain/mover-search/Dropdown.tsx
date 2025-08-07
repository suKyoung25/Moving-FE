// 최적화된 Dropdown.tsx - 완전한 버전
"use client";

import Image from "next/image";
import { useEffect, useRef, useState, memo, useCallback, useMemo } from "react";
import chevronDownBlackIcon from "@/assets/images/chevronDownBlackIcon.svg";
import chevronDownBlueIcon from "@/assets/images/chevronDownBlueIcon.svg";
import { DropdownOption } from "@/lib/types/mover.types";

interface DropdownProps {
   label: string;
   options: DropdownOption[];
   onSelect?: (option: DropdownOption) => void;
   multiColumn?: boolean;
   value?: string;
}

// React.memo로 불필요한 리렌더링 방지
export default memo(function Dropdown
   ({
      label,
      options,
      onSelect,
      multiColumn = false,
      value,
   }: DropdownProps) {
      const [isOpen, setIsOpen] = useState(false);
      const [selected, setSelected] = useState(label);
      const dropdownRef = useRef<HTMLDivElement>(null);

      // 현재 선택된 옵션을 메모이제이션 (매번 find 연산 방지)
      const currentOption = useMemo(
         () => options.find((opt) => opt.value === value),
         [options, value],
      );

      // 외부에서 value가 변경되면 selected 업데이트
      useEffect(() => {
         if (currentOption) {
            setSelected(currentOption.label);
         }
      }, [currentOption]);

      // 옵션 선택 핸들러를 메모이제이션
      const handleSelect = useCallback(
         (option: DropdownOption) => {
            setSelected(option.label);
            setIsOpen(false);
            onSelect?.(option);
         },
         [onSelect],
      );

      // 드롭다운 토글 핸들러를 메모이제이션
      const toggleDropdown = useCallback(() => {
         setIsOpen((prev) => !prev);
      }, []);

      // 외부 클릭 핸들러 최적화 - 열려있을 때만 이벤트 리스너 등록
      useEffect(() => {
         if (!isOpen) return; // 닫혀있으면 리스너를 등록하지 않음 (성능 향상)

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
      }, [isOpen]);

      // 클래스명들을 메모이제이션 (매번 문자열 연산 방지)
      const buttonClassName = useMemo(() => {
         const baseClasses = `flex items-center justify-between ${
            multiColumn ? "" : "w-auto lg:w-80"
         } text-14-medium lg:text-18-medium rounded-lg border px-3 py-2 text-left lg:rounded-2xl lg:px-4 h-9 w-20 lg:h-15 lg:w-80`;

         return isOpen
            ? `${baseClasses} border-primary-blue-300 text-primary-blue-300 bg-primary-blue-50`
            : `${baseClasses} border-gray-100 bg-white`;
      }, [isOpen, multiColumn]);

      const dropdownClassName = useMemo(() => {
         const baseClasses =
            "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-gutter-stable absolute z-10 mt-2 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-md";
         return multiColumn
            ? `${baseClasses} h-44 w-40 lg:h-80 lg:w-80`
            : baseClasses;
      }, [multiColumn]);

      return (
         <div ref={dropdownRef} className="relative">
            {/* 드롭다운 버튼 */}
            <button onClick={toggleDropdown} className={buttonClassName}>
               {selected}
               <Image
                  src={isOpen ? chevronDownBlueIcon : chevronDownBlackIcon}
                  alt="드롭다운"
                  className="h-5 w-5"
               />
            </button>

            {/* 옵션 목록 */}
            {isOpen && (
               <div className={dropdownClassName}>
                  {multiColumn ? (
                     // 다중 컬럼 레이아웃
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
                     // 단일 컬럼 레이아웃
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
   },
);



