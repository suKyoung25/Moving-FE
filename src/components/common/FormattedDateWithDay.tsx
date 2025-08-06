"use client";

import React from "react";
import { format, Locale } from "date-fns";
import { ko, enUS, zhCN } from "date-fns/locale";
import { useLocale } from "next-intl";

interface FormattedDateWithDayProps {
   dateString: string;
}

export default function FormattedDateWithDay({
   dateString,
}: FormattedDateWithDayProps) {
   const locale = useLocale();

   const localeMap: Record<string, Locale> = {
      ko,
      en: enUS,
      zh: zhCN,
   };

   const currentLocale = localeMap[locale] || ko;

   const date = new Date(dateString);

   const formatted = format(date, "yyyy-MM-dd (eee)", {
      locale: currentLocale,
   });

   return <>{formatted}</>;
}
