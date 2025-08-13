"use client";

import { useState, useEffect } from "react";
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

   // 디바운스 처리
   useEffect(() => {
      const timer = setTimeout(() => {
         onSearchChange(searchTerm);
      }, 500);

      return () => clearTimeout(timer);
   }, [searchTerm, onSearchChange]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearchChange(searchTerm);
   };

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
               placeholder={t("searchPlaceholder")}
               className="text-14-regular lg:text-20-regular w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
               aria-label={t("searchInputAria")}
            />
         </div>
      </form>
   );
}
