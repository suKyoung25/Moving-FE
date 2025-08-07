import MoveChip from "@/components/common/MoveChip";
import { isChipType } from "@/lib/utils";
import { format, Locale } from "date-fns";
import { enUS, ko, zhCN } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

interface QuotaionInfoProps {
   fromAddress: string;
   toAddress: string;
   moveDate: string;
   moveType: string;
   requestedAt: string;
   chipType?: string;
   isRequestedTap?: boolean;
}

export default function QuotaionInfo({
   fromAddress,
   moveDate,
   moveType,
   toAddress,
   requestedAt,
   chipType,
   isRequestedTap,
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

   return (
      <article>
         <p className="text-16-semibold lg:text-24-semibold mb-6 lg:mb-10">
            {isRequestedTap ? t("requestInfoTitle") : t("estimateInfoTitle")}
         </p>
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
               <p>{format(requestedAt, "yy.MM.dd")}</p>
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">
                  {t("labels.service")}
               </p>
               <p>{t(`${moveType}`)}</p>
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">
                  {t("labels.moveDate")}
               </p>
               <p className="">
                  {format(moveDate, "yyyy. MM. dd(eee) aa hh:mm", {
                     locale: currentLocale,
                  })}
               </p>
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">
                  {t("labels.from")}
               </p>
               <p>{fromAddress}</p>
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">
                  {t("labels.to")}
               </p>
               <p>{toAddress}</p>
            </li>
         </ul>
      </article>
   );
}
