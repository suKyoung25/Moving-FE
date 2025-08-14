"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Search from "@/assets/images/searchIcon.svg";
import { useTranslations } from "next-intl";

interface SearchBarProps {
   onSearchChange: (search: string) => void;
   initialValue?: string;
}

export default function SearchBar({
   onSearchChange,
   initialValue = "",
}: SearchBarProps) {
   const t = useTranslations("MoverSearch");
   
   const [searchTerm, setSearchTerm] = useState(initialValue);
   const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
   
   // ✅ onSearchChange를 useCallback으로 안정화된 함수로 받거나, useRef로 처리
   const onSearchChangeRef = useRef(onSearchChange);
   
   // ✅ onSearchChange가 변경될 때마다 ref 업데이트
   useEffect(() => {
      onSearchChangeRef.current = onSearchChange;
   }, [onSearchChange]);

   // ✅ 디바운스 처리 - 의존성 배열에서 onSearchChange 제거
   useEffect(() => {
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
         onSearchChangeRef.current(searchTerm);
      }, 500);

      return () => {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
         }
      };
   }, [searchTerm]); // ✅ searchTerm 변화에만 반응

   // ✅ 즉시 검색 처리 (Enter 키 또는 폼 제출) - 새로고침 방지
   const handleSubmit = useCallback((e: React.FormEvent) => {
      e.preventDefault(); // ✅ 폼 기본 제출 동작 방지
      e.stopPropagation(); // ✅ 이벤트 버블링 방지
      
      // 기존 타이머 클리어
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
      }
      
      // 즉시 검색 실행
      onSearchChangeRef.current(searchTerm);
   }, [searchTerm]);

   // ✅ Enter 키 핸들러 추가 (input에서 직접 처리)
   const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
         e.preventDefault(); // ✅ Enter 키 기본 동작 방지
         handleSubmit(e as React.FormEvent);
      }
   }, [handleSubmit]);

   // ✅ initialValue 변경 시 searchTerm 업데이트
   useEffect(() => {
      setSearchTerm(initialValue);
   }, [initialValue]);

   // ✅ 컴포넌트 언마운트 시 타이머 정리
   useEffect(() => {
      return () => {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
         }
      };
   }, []);

   return (
      <form onSubmit={handleSubmit} className="w-full">
         <div className="bg-bg-200 flex h-13 w-full items-center gap-2 rounded-2xl px-4 py-3.5 lg:h-16 lg:gap-3 lg:px-6">
            <Image
               src={Search}
               alt={t("searchAlt")}
               className="h-6 w-6 lg:h-8 lg:w-8"
            />
            <input
               type="text"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               onKeyDown={handleKeyDown} // ✅ Enter 키 핸들러 추가
               placeholder={t("searchPlaceholder")}
               className="text-14-regular lg:text-20-regular w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
               aria-label={t("searchInputAria")}
               autoComplete="off" // ✅ 브라우저 자동완성 방지
            />
         </div>
      </form>
   );
}