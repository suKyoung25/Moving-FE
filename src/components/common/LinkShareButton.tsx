"use client";

import { useState } from "react";
import Image from "next/image";
import shareLinkIcon from "@/assets/images/shareLinkIcon.svg";
import { useTranslations } from "next-intl";

export default function LinkShareButton() {
   const t = useTranslations("ShareButton");

   const [copied, setCopied] = useState(false);
   const [isHovered, setIsHovered] = useState(false);

   const handleClick = async () => {
      try {
         await navigator.clipboard.writeText(window.location.href);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch (err) {
         console.error("URL 복사 실패:", err);
      }
   };

   return (
      <div
         className="relative flex flex-col items-center"
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
      >
         {/* Tooltip */}
         <div
            className={`bg-black-400 absolute -top-[70%] left-0 z-10 rounded px-2 py-1 text-xs text-nowrap text-white shadow transition-opacity duration-400 lg:-top-[40%] lg:left-1/2 lg:-translate-x-1/2 ${
               isHovered
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0"
            }`}
         >
            {copied ? t("copied") : t("copyUrl")}
         </div>

         {/* Button */}
         <div className="relative h-10 w-10 lg:h-16 lg:w-16">
            <button onClick={handleClick} aria-label={t("ariaLabel")}>
               <Image
                  src={shareLinkIcon}
                  alt={t("altText")}
                  className="h-full w-full"
               />
            </button>
         </div>
      </div>
   );
}
