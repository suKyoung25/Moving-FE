"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Search from "@/assets/images/searchIcon.svg";
import { useMover } from "./MoverStateControll";

export default function SearchBar() {
   const { state, setFilters } = useMover();
   const [searchTerm, setSearchTerm] = useState(state.filters.search);

   // ✅ Context의 검색어가 외부에서 변경될 때 input 값 동기화
   useEffect(() => {
      if (state.filters.search !== searchTerm) {
         setSearchTerm(state.filters.search);
      }
   }, [state.filters.search]);

   // ✅ useCallback으로 setFilters 의존성 최적화
   const updateSearch = useCallback((value: string) => {
      setFilters({ search: value });
   }, [setFilters]);

   // ✅ 디바운스 처리 개선
   useEffect(() => {
      const timer = setTimeout(() => {
         updateSearch(searchTerm);
      }, 500);

      return () => clearTimeout(timer);
   }, [searchTerm, updateSearch]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // ✅ 즉시 검색 (디바운스 타이머 무시)
      updateSearch(searchTerm);
   };

   // ✅ 검색어 초기화 함수 추가
   const handleClear = () => {
      setSearchTerm("");
      updateSearch("");
   };

   return (
      <form onSubmit={handleSubmit} className="w-full">
         <div className="bg-bg-200 flex h-14 w-full items-center rounded-xl px-4 py-3 text-gray-400">
            <Image src={Search} alt="검색" className="mr-2 h-7 w-7" />
            <input
               type="text"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="기사님 이름을 검색해주세요."
               className="text-14-regular lg:text-20-regular w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            {/* ✅ 검색어가 있을 때 초기화 버튼 표시 */}
            {searchTerm && (
               <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
                  aria-label="검색어 초기화"
               >
                  ×
               </button>
            )}
         </div>
         {/* ✅ 현재 적용된 검색어 표시 (선택적) */}
         {state.filters.search && (
            <div className="mt-2 text-sm text-gray-500">
               검색 중: <span className="font-medium">&quot;{state.filters.search}&quot;</span>
            </div>
         )}
      </form>
   );
}
