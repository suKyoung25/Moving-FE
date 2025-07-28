// LanguageSwitcherMobile.tsx
"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcherMobile({
   setIsHamburgerOpen,
}: {
   setIsHamburgerOpen: (val: boolean) => void;
}) {
   const router = useRouter();
   const pathname = usePathname();
   const locale = useLocale();

   const changeLocale = (newLocale: string) => {
      const segments = pathname.split("/");
      segments[1] = newLocale;
      const newPath = segments.join("/");

      setIsHamburgerOpen(false);
      setTimeout(() => {
         router.push(newPath);
      }, 400);
   };

   return (
      <div className="md:text-18-medium text-16-medium absolute bottom-6 left-6 flex items-center text-gray-400 md:bottom-14 md:left-14">
         {[
            { label: "KO", code: "ko" },
            { label: "EN", code: "en" },
            { label: "ZH", code: "zh" },
         ].map(({ label, code }, idx) => (
            <div key={label} className="flex items-center">
               <button
                  disabled={locale === code}
                  onClick={() => changeLocale(code)}
                  className="disabled:!text-black-400 disabled:font-semibold"
                  type="button"
               >
                  {label}
               </button>
               {idx < 2 && (
                  <span className="mx-2 h-3 w-0.25 bg-gray-400 md:mx-3" />
               )}
            </div>
         ))}
      </div>
   );
}
