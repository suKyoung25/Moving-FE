"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
   LanguageCode,
   localeToSelected,
   selectedToLocale,
   getCurrentLocale,
   getReplacedLocalePath,
} from "@/lib/utils/language.utils";

export default function LanguageSwitcherMobile() {
   const router = useRouter();
   const pathname = usePathname();

   const [selected, setSelected] = useState<LanguageCode>(
      localeToSelected(getCurrentLocale(pathname)),
   );

   useEffect(() => {
      setSelected(localeToSelected(getCurrentLocale(pathname)));
   }, [pathname]);

   const handleChangeLanguage = (langSelected: LanguageCode) => {
      if (langSelected === selected) return;
      const newLocale = selectedToLocale(langSelected);
      router.replace(getReplacedLocalePath(pathname, newLocale));
      setSelected(langSelected);
   };

   return (
      <div className="md:text-18-medium text-16-medium absolute bottom-6 left-6 flex items-center text-gray-400 md:bottom-14 md:left-16">
         {(["KR", "EN", "ZH"] as LanguageCode[]).map((lang, idx) => (
            <div key={lang} className="flex items-center">
               <button
                  onClick={() => handleChangeLanguage(lang)}
                  className={
                     selected === lang ? "!text-black-400 font-semibold" : ""
                  }
               >
                  {lang}
               </button>
               {idx < 2 && (
                  <span className="mx-2 h-3 w-0.25 bg-gray-400 md:mx-3" />
               )}
            </div>
         ))}
      </div>
   );
}
