import React from "react";
import { HiCalculator } from "react-icons/hi";
import { LuMessageSquareWarning } from "react-icons/lu";
import Image from "next/image";
import gptIcon from "@/assets/images/gptIcon.svg";
import { useTranslations } from "next-intl";

export default function InfoFooter() {
   const t = useTranslations("Calculator.info");

   return (
      <section
         className="mx-auto max-w-6xl text-left"
         aria-labelledby="info-title"
      >
         <h2 id="info-title" className="mb-4 text-lg font-semibold">
            {t("title")}
         </h2>
         <div
            className="text-black-400 grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-6 text-sm md:grid-cols-3"
            role="list"
            aria-label="견적 계산기 기능 설명"
         >
            <div className="flex items-start gap-2" role="listitem">
               <HiCalculator
                  className="mt-1 h-5 w-5 text-gray-500"
                  aria-hidden="true"
               />
               <div>
                  <p className="text-14-medium">{t("basic.title")}</p>
                  <p className="text-12-regular mt-1">
                     {t("basic.description")}
                  </p>
               </div>
            </div>
            <div className="flex items-start gap-2" role="listitem">
               <Image
                  src={gptIcon}
                  alt="gptIcon"
                  width={16}
                  height={16}
                  className="mt-1 ml-0.5"
               />
               <div>
                  <p className="text-14-medium">{t("ai.title")}</p>
                  <p className="text-12-regular mt-1">{t("ai.description")}</p>
               </div>
            </div>
            <div className="items-MdStart flex gap-2" role="listitem">
               <LuMessageSquareWarning
                  className="mt-1 h-4 w-4 text-gray-500"
                  aria-hidden="true"
               />
               <div>
                  <p className="text-14-medium">{t("notes.title")}</p>
                  <p className="text-12-regular mt-1">
                     {t("notes.description")}
                  </p>
               </div>
            </div>
         </div>
      </section>
   );
}
