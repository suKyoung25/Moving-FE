"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

export default function LanguageSwitcherDesktop() {
   const router = useRouter();
   const pathname = usePathname();
   const locale = useLocale();
   const [open, setOpen] = useState(false);

   const wrapperRef = useRef<HTMLDivElement | null>(null);
   useOutsideClick(wrapperRef, () => setOpen(false));

   const handleChangeLanguage = (newLocale: string) => {
      if (newLocale === locale) return;
      const segments = pathname.split("/");
      segments[1] = newLocale;
      const newPath = segments.join("/");
      setTimeout(() => {
         router.replace(newPath);
      }, 300);
      setOpen(false);
   };

   const displayLabel = locale.toUpperCase();

   return (
      <div ref={wrapperRef} className="relative z-10 hidden lg:inline-block">
         <div
            onClick={() => setOpen((prev) => !prev)}
            className="flex cursor-pointer items-center gap-1"
         >
            <span className="text-14-semibold">{displayLabel}</span>
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
                  {[
                     { label: "KO", code: "ko" },
                     { label: "EN", code: "en" },
                     { label: "ZH", code: "zh" },
                  ].map(({ label, code }) => (
                     <button
                        key={code}
                        onClick={() => handleChangeLanguage(code)}
                        className={`px-3 py-2 text-sm ${
                           locale === code
                              ? "text-black-400 font-semibold underline"
                              : ""
                        }`}
                     >
                        {label}
                     </button>
                  ))}
               </motion.nav>
            )}
         </AnimatePresence>
      </div>
   );
}
