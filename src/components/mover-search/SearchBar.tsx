"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Search from "@/assets/images/searchIcon.svg";
import { useMover } from "@/context/MoverContext";

export default function SearchBar() {
   const { state, setFilters } = useMover();
   const [searchTerm, setSearchTerm] = useState(state.filters.search);

   // 디바운스 처리
   useEffect(() => {
      const timer = setTimeout(() => {
         setFilters({ search: searchTerm });
      }, 500);

      return () => clearTimeout(timer);
   }, [searchTerm, setFilters]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setFilters({ search: searchTerm });
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
         </div>
      </form>
   );
}
