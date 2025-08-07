"use client";

import MoveChip from "@/components/common/MoveChip";
import { isChipType } from "@/lib/utils";
import { format, Locale } from "date-fns";
import { enUS, ko, zhCN } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import more from "@/assets/images/moreGrayIcon.svg";
import { useRef, useState } from "react";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { Quotes } from "@/lib/types";

interface QuotaionInfoProps {
   request: Pick<
      Quotes,
      "fromAddress" | "toAddress" | "moveDate" | "moveType" | "requestedAt"
   >;
   chipType?: string;
   isPending?: boolean;
   onClick?: () => void;
}

export default function QuotaionInfo({
   request,
   chipType,
   isPending,
   onClick,
}: QuotaionInfoProps) {
   const t = useTranslations("MyQuotes.Client");
   const locale = useLocale();

   // date-fns locale 매핑
   const localeMap: Record<string, Locale> = {
      ko,
      en: enUS,
      zh: zhCN,
   };
   const currentLocale = localeMap[locale] || ko;

   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   useOutsideClick(dropdownRef, () => setIsDropdownOpen(false));

   return (
      <article ref={dropdownRef} className="relative">
         <ul className="border-line-100 bg-bg-100 text-14-regular lg:text-18-regular flex flex-col gap-2.5 rounded-2xl border px-5 py-4">
            <li>
               {chipType && isChipType(chipType) && (
                  <MoveChip type={chipType} />
               )}
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">
                  {t("labels.requestedAt")}
               </p>
               <p>{format(request.requestedAt, "yy.MM.dd")}</p>
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">
                  {t("labels.service")}
               </p>
               <p>{t(`${request.moveType}`)}</p>
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">
                  {t("labels.moveDate")}
               </p>
               <p>
                  {format(request.moveDate, "yyyy. MM. dd(eee) aa hh:mm", {
                     locale: currentLocale,
                  })}
               </p>
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">
                  {t("labels.from")}
               </p>
               <p>{request.fromAddress}</p>
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">
                  {t("labels.to")}
               </p>
               <p>{request.toAddress}</p>
            </li>
         </ul>
         {isPending && (
            <button
               type="button"
               onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
               <Image
                  src={more}
                  width={16}
                  height={16}
                  alt="요청 취소"
                  style={{ transform: "rotate(90deg)" }}
                  className="absolute top-6 right-2.5"
               />
            </button>
         )}
         {isDropdownOpen && (
            <button
               type="button"
               onClick={onClick}
               className="border-line-100 text-14-medium lg:text-18-medium absolute top-10 right-2.5 h-9 rounded-lg border bg-white px-6 py-1.5 hover:bg-gray-50 lg:h-16 lg:rounded-2xl lg:px-6 lg:py-4"
            >
               취소하기
            </button>
         )}
      </article>
   );
}
