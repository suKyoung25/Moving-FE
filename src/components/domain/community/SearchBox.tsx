"use client";

import Image from "next/image";
import Search from "@/assets/images/searchIcon.svg";
import { useTranslations } from "next-intl";

interface SearchBoxProps {
   search: string;
   setSearch: (value: string) => void;
}

export default function SearchBox({ search, setSearch }: SearchBoxProps) {
   const t = useTranslations("Community");
   return (
      <div className="relative mt-7.5">
         <Image
            src={Search}
            alt={t("searchIconAlt")}
            width={24}
            height={24}
            className="absolute top-1/2 left-4 -translate-y-1/2"
         />
         <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder={t("searchPlaceholder")}
            className="bg-bg-200 h-14 w-full rounded-2xl pr-4 pl-11.5"
            aria-label={t("searchInputAria")}
         />
      </div>
   );
}
