"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type LanguageCode = "KR" | "EN" | "ZH";

// mapping 정의 (locale와 버튼 선택값 간)
const localeToSelected = (locale: string): LanguageCode => {
   switch (locale) {
      case "ko":
         return "KR";
      case "en":
         return "EN";
      case "zh":
         return "ZH";
      default:
         return "KR";
   }
};

const selectedToLocale = (selected: LanguageCode): string => {
   switch (selected) {
      case "KR":
         return "ko";
      case "EN":
         return "en";
      case "ZH":
         return "zh";
   }
};

// locale 추출
function getCurrentLocale(pathname: string): string {
   const matched = pathname.match(/^\/(ko|en|zh)(\/|$)/);
   return matched ? matched[1] : "ko";
}

export default function LanguageSwitcher() {
   const router = useRouter();
   const pathname = usePathname();

   // 선택한 언어 상태 관리
   const [selected, setSelected] = useState<LanguageCode>(
      localeToSelected(getCurrentLocale(pathname)),
   );

   // pathname 변경에 따른 selected 동기화
   useEffect(() => {
      setSelected(localeToSelected(getCurrentLocale(pathname)));
   }, [pathname]);

   // 언어 변경 핸들러
   const handleChangeLanguage = (langSelected: LanguageCode) => {
      if (langSelected === selected) return;

      setSelected(langSelected);

      const newLocale = selectedToLocale(langSelected);

      // pathname에서 기존 locale 제거
      let newPathname = pathname.replace(/^\/(ko|en|zh)/, "");
      if (!newPathname.startsWith("/")) newPathname = "/" + newPathname;
      if (newPathname === "") newPathname = "/";

      // locale prefix 추가
      const localePrefixedPath = `/${newLocale}${newPathname}`;

      // locale이 바뀐 URL로 라우팅
      router.replace(localePrefixedPath);
   };

   return (
      <div className="text-18-regular md:text-20-regular absolute bottom-6 left-6 flex items-center md:bottom-16 md:left-16 [&_*]:text-gray-400">
         <button
            onClick={() => handleChangeLanguage("KR")}
            className={selected === "KR" ? "!text-black-400 font-bold" : ""}
            type="button"
         >
            KR
         </button>
         <span className="mx-2 h-3 w-0.25 bg-gray-400 md:mx-3" />
         <button
            onClick={() => handleChangeLanguage("EN")}
            className={selected === "EN" ? "!text-black-400 font-bold" : ""}
            type="button"
         >
            EN
         </button>
         <span className="mx-2 h-3 w-0.25 bg-gray-400 md:mx-3" />
         <button
            onClick={() => handleChangeLanguage("ZH")}
            className={selected === "ZH" ? "!text-black-400 font-bold" : ""}
            type="button"
         >
            ZH
         </button>
      </div>
   );
}
