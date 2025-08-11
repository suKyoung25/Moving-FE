import Calculator from "@/components/domain/estimate-calculator/Calculator";
import Image from "next/image";
import React from "react";
import calcBlack from "@/assets/images/calcBlack.svg";
import calcWhite from "@/assets/images/calcWhite.svg";
import { useTranslations } from "next-intl";

export default function EstimateCalculatePage() {
   const t = useTranslations("Calculator");

   return (
      <>
         <header className="bg-primary-blue-100 relative flex h-80 flex-col items-center gap-2 overflow-hidden py-14 text-center md:h-100 md:py-20">
            <h1 className="text-24-bold md:text-32-bold">{t("title")}</h1>
            <p className="text-14-regular md:text-16-regular text-gray-500">
               {t("description")}
            </p>
            <div className="absolute -bottom-30 flex gap-2 md:-bottom-40 md:gap-3">
               <div className="w-18 translate-x-25 rounded-4xl bg-sky-900/50 blur-2xl" />
               <Image
                  src={calcWhite}
                  alt="white calculator"
                  className="z-1 w-30 -translate-y-4 md:w-40"
               />
               <Image
                  src={calcBlack}
                  alt="black calculator"
                  className="z-1 w-30 md:w-40"
               />
               <div className="w-18 -translate-x-20 rounded-4xl bg-sky-900/80 blur-2xl" />
            </div>
         </header>
         <Calculator />
      </>
   );
}
