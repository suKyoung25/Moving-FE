"use client";

import { useRouter, useSearchParams } from "next/navigation";
import MoveChip, { ChipType } from "@/components/common/MoveChip";
import MoveTextCard from "@/components/domain/my-quotes/MoveTextCard";
import { MyEstimateDetail } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";
import { enUS, ko, Locale, zhCN } from "date-fns/locale";
import { format } from "date-fns";
import formatAddress from "@/lib/utils/formatAddress.util";

export default function QuoteCard({
   estimate,
   onRequestCancel,
}: {
   estimate: MyEstimateDetail;
   onRequestCancel: (id: string) => void;
}) {
   const t = useTranslations("MyQuotes.Mover");
   const locale = useLocale();

   const router = useRouter();
   const searchParams = useSearchParams();
   const tab = searchParams.get("tab");

   const { request, moverId, isClientConfirmed, price, id } = estimate;
   const {
      moveDate,
      moveType,
      client,
      fromAddress,
      toAddress,
      designatedRequests,
   } = request;

   const isPastMoveDate = new Date(moveDate) < new Date();
   const isDesignated = designatedRequests.some(
      (d: { moverId: string }) => d.moverId === moverId,
   );

   const handleCardClick = () => {
      router.push(`/my-quotes/mover/${id}`);
   };

   const localeMap: Record<string, Locale> = {
      ko,
      en: enUS,
      zh: zhCN,
   };
   const currentLocale = localeMap[locale] || ko;

   const formattedDate = format(new Date(moveDate), "yyyy-MM-dd (eee)", {
      locale: currentLocale,
   });

   return (
      <div
         onClick={!isPastMoveDate ? handleCardClick : undefined}
         className={`relative rounded-2xl bg-white px-3.5 py-4 shadow ${
            !isPastMoveDate && "cursor-pointer"
         } ${
            isPastMoveDate
               ? "after:absolute after:inset-0 after:h-full after:w-full after:rounded-2xl after:bg-black/50 after:content-[''] lg:px-6 lg:py-5"
               : ""
         }`}
      >
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 md:gap-2">
               {isClientConfirmed && (
                  <div className="w-fit rounded-sm bg-gray-800 px-1.5 py-0.5 lg:py-1">
                     <span className="text-13-semibold lg:text-16-semibold">
                        {t("confirmedLabel")}
                     </span>
                  </div>
               )}
               <MoveChip type={(moveType as ChipType) ?? "PENDING"} />
               {isDesignated && <MoveChip type="DESIGNATED" />}
            </div>

            {!isPastMoveDate && !isClientConfirmed && (
               <button
                  className="text-12-regular lg:text-14-regular text-gray-400"
                  onClick={(e) => {
                     e.stopPropagation();
                     onRequestCancel(id); // 상위에서 모달 오픈 처리
                  }}
               >
                  {t("cancelButton")}
               </button>
            )}
         </div>

         <div className="mt-3.5 md:flex md:flex-col md:gap-2.5 lg:mt-4 lg:gap-6">
            <span className="text-16-semibold lg:text-20-semibold">
               {client.name} {t("clientHonorific")}
            </span>
            <div className="border-line-100 hidden w-full border-b md:block"></div>

            <div className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:gap-3.5 [&_div]:flex [&_div]:items-center">
               <div className="mt-3.5 gap-2 md:mt-0">
                  <MoveTextCard text={t("moveDateLabel")} />
                  <span className="text-14-medium lg:text-18-medium">
                     {formattedDate}
                  </span>
               </div>
               <div className="border-line-100 w-full border-b md:!hidden"></div>
               <div className="gap-3.5">
                  <div className="gap-2">
                     <MoveTextCard text={t("departureLabel")} />
                     <span className="text-14-medium lg:text-18-medium">
                        {formatAddress(fromAddress, locale)}
                     </span>
                  </div>
                  <div className="gap-2">
                     <MoveTextCard text={t("destinationLabel")} />
                     <span className="text-14-medium lg:text-18-medium">
                        {formatAddress(toAddress, locale)}
                     </span>
                  </div>
               </div>
            </div>

            {tab === "1" && (
               <div className="mt-4 flex items-center justify-end gap-2 lg:mt-6 lg:gap-4">
                  <span className="text-14-medium lg:text-18-medium">
                     {t("priceLabel")}
                  </span>
                  <span className="text-18-bold lg:text-24-bold">
                     {Number(price).toLocaleString()} {t("money")}
                  </span>
               </div>
            )}

            {isPastMoveDate && (
               <div className="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-white lg:gap-3">
                  <span className="text-16-semibold lg:text-18-semibold">
                     {t("moveCompletedLabel")}
                  </span>
                  <button
                     className="border-primary-blue-200 lg:text-16-semibold text-14-semibold text-primary-blue-300 bg-primary-blue-100 w-fit rounded-2xl border px-4 py-2 lg:px-4.5 lg:py-2.5"
                     onClick={handleCardClick}
                  >
                     {t("detailsButton")}
                  </button>
               </div>
            )}
         </div>
      </div>
   );
}
