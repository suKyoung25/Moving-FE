"use client";

import Image from "next/image";
import Search from "@/assets/images/searchIcon.svg";

interface SearchBoxProps {
   search: string;
   setSearch: (value: string) => void;
}

export default function SearchBox({ search, setSearch }: SearchBoxProps) {
   return (
      <div className="relative mt-7.5">
         <Image
            src={Search}
            alt="검색아이콘"
            width={24}
            height={24}
            className="absolute top-1/2 left-4 -translate-y-1/2"
         />
         <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder="텍스트를 입력해 주세요"
            className="bg-bg-200 h-14 w-full rounded-2xl pr-4 pl-11.5"
         />
      </div>
   );
}
