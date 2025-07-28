"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
   const router = useRouter();
   const pathname = usePathname();
   const locale = useLocale();

   const changeLocale = (newLocale: string) => {
      // pathname이 "/ko/page"일 때 "/en/page"로 변경 locale 부분만 바꿈
      const segments = pathname.split("/");
      segments[1] = newLocale;
      const newPath = segments.join("/");
      router.push(newPath);
   };

   return (
      <div className="text-18-regular md:text-20-regular absolute bottom-6 left-6 flex items-center md:bottom-16 md:left-16 [&_*]:text-gray-400">
         <button
            disabled={locale === "ko"}
            onClick={() => changeLocale("ko")}
            className="disabled:!text-black-400 disabled:font-bold"
            type="button"
         >
            KR
         </button>
         <span className="mx-2 h-3 w-0.25 bg-gray-400 md:mx-3" />
         <button
            disabled={locale === "en"}
            onClick={() => changeLocale("en")}
            className="disabled:!text-black-400 disabled:font-bold"
            type="button"
         >
            EN
         </button>
         <span className="mx-2 h-3 w-0.25 bg-gray-400 md:mx-3" />
         <button
            disabled={locale === "zh"}
            onClick={() => changeLocale("zh")}
            className="disabled:!text-black-400 disabled:font-bold"
            type="button"
         >
            ZH
         </button>
      </div>
   );
}
