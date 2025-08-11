"use client";

import { useActiveRequest } from "@/lib/api/request/requests/query";
import { format, Locale } from "date-fns";
import { enUS, ko, zhCN } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";

const contentClass =
   "flex md:w-fit items-center justify-between md:flex-col md:items-start";
const labelClass = "text-14-regular text-gray-300 md:text-16-medium";
const valueClass = "text-14-semibold text-black-300 md:text-18-semibold";

export default function ActiveRequest() {
   const t = useTranslations("MyQuotes.Client");
   const locale = useLocale();

   const { data: result, isPending } = useActiveRequest(locale);
   const activeRequest = result?.data;

   // date-fns locale을 next-intl의 locale에 맞게 매핑
   const localeMap: Record<string, Locale> = {
      ko,
      en: enUS,
      zh: zhCN,
   };
   const currentLocale = localeMap[locale] || ko;

   if (isPending) return;

   if (!activeRequest) return;

   return (
      <article className="bg-primary-blue-50 px-6 py-5 break-keep md:px-18 md:py-8 lg:px-0">
         <div className="flex w-full gap-5 max-lg:flex-col md:gap-7 lg:mx-auto lg:max-w-350">
            <div className="flex w-full flex-col">
               <span className="text-12-semibold md:text-14-semibold text-primary-blue-300 mb-2">
                  {t("myRequestTitle")}
               </span>
               <h2 className="text-black-500 text-18-semibold md:text-24-semibold">
                  {t(`${activeRequest.moveType}`)}
               </h2>
               <div className="text-12-regular md:text-16-medium text-gray-500">
                  {t("requestedAtLabel")}{" "}
                  {format(
                     activeRequest.requestedAt,
                     t("requestedAtDateFormat"),
                  )}
               </div>
            </div>
            <div className="flex w-full max-md:flex-col max-md:gap-1 md:gap-10 lg:items-center lg:justify-end">
               <div className="w-full md:flex md:w-fit md:gap-3">
                  <div className={contentClass}>
                     <div className={labelClass}>{t("fromLabel")}</div>
                     <div className={valueClass}>
                        {activeRequest.fromAddress}
                     </div>
                  </div>
                  <IoIosArrowRoundForward className="h-6 w-6 self-end max-md:hidden" />
                  <div className={contentClass}>
                     <div className={labelClass}>{t("toLabel")}</div>
                     <div className={valueClass}>{activeRequest.toAddress}</div>
                  </div>
               </div>
               <div className={contentClass}>
                  <div className={labelClass}>{t("moveDateLabel")}</div>
                  <div className={valueClass}>
                     {format(activeRequest.moveDate, t("moveDateFormat"), {
                        locale: currentLocale,
                     })}
                  </div>
               </div>
            </div>
         </div>
      </article>
   );
}
