"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import {
   LanguageCode,
   localeToSelected,
   selectedToLocale,
   getCurrentLocale,
   getReplacedLocalePath,
} from "@/lib/utils/language.utils";

export default function LanguageSwitcherDesktop() {
   const router = useRouter();
   const pathname = usePathname();

   const [open, setOpen] = useState(false);
   const [selected, setSelected] = useState<LanguageCode>(
      localeToSelected(getCurrentLocale(pathname)),
   );

   const wrapperRef = useRef<HTMLDivElement | null>(null);
   useOutsideClick(wrapperRef, () => setOpen(false));

   useEffect(() => {
      setSelected(localeToSelected(getCurrentLocale(pathname)));
   }, [pathname]);

   const handleChangeLanguage = (lang: LanguageCode) => {
      if (lang === selected) return;
      const newLocale = selectedToLocale(lang);

      setTimeout(() => {
         router.replace(getReplacedLocalePath(pathname, newLocale));
      }, 300);
      setSelected(lang);
      setOpen(false);
   };

   return (
      <div ref={wrapperRef} className="relative z-10 hidden lg:inline-block">
         <div
            onClick={() => setOpen((prev) => !prev)}
            className="flex cursor-pointer items-center gap-1"
         >
            <span className="text-14-medium">{selected}</span>
            <span
               className={`transition-transform duration-300 ${
                  open ? "rotate-180" : ""
               }`}
            >
               <RiArrowDropDownLine size={24} />
            </span>
         </div>

         <AnimatePresence>
            {open && (
               <motion.nav
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="border-line-100 absolute left-0 mt-2 flex w-max flex-col overflow-hidden rounded border bg-white text-left"
               >
                  {(["KR", "EN", "ZH"] as LanguageCode[]).map((lang) => (
                     <button
                        key={lang}
                        onClick={() => handleChangeLanguage(lang)}
                        className={`px-3 py-2 text-sm ${
                           selected === lang
                              ? "text-black-400 font-semibold underline"
                              : ""
                        }`}
                     >
                        {lang}
                     </button>
                  ))}
               </motion.nav>
            )}
         </AnimatePresence>
      </div>
   );
}
