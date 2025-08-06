import MoveChip from "@/components/common/MoveChip";
import { getSentEstimateDetail } from "@/lib/api/estimate/requests/getSentEstimateDetail";
import { notFound } from "next/navigation";
import MoveTextCard from "./MoveTextCard";
import SocialShareGroup from "@/components/common/SocialShareGroup";
import DesignatedBadge from "./DesignatedBadge";
import PageTitle from "@/components/layout/PageTitle";
import FormattedDateWithDay from "@/components/common/FormattedDateWithDay";
import { getTranslations } from "next-intl/server";

export default async function SentQuoteDetailContent({ id }: { id: string }) {
   const t = await getTranslations("MyQuotes.Mover.Detail");

   const estimate = await getSentEstimateDetail(id);
   if (!estimate || !estimate.request) return notFound();

   const { request, price, isClientConfirmed, createdAt } = estimate;

   return (
      <>
         <div className="border-line-100 rounded-2xl border bg-white px-3.5 py-4 lg:px-6 lg:py-5">
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-2 lg:gap-3">
                  {isClientConfirmed && (
                     <div className="w-fit rounded-sm bg-gray-800 px-1.5 py-0.5 lg:py-1">
                        <span className="text-13-semibold lg:text-16-semibold">
                           {t("confirmedLabel")}
                        </span>
                     </div>
                  )}
                  <MoveChip type={request.moveType} />
                  <DesignatedBadge
                     designatedRequest={request.designatedRequests}
                  />
               </div>
               <p className="text-16-semibold lg:text-20-semibold">
                  {request.client.name} {t("clientHonorific")}
               </p>
               <div className="flex items-center gap-2 md:hidden">
                  <MoveTextCard text={t("moveDateLabel")} />
                  <span className="text-14-medium lg:text-18-medium">
                     <FormattedDateWithDay dateString={request.moveDate} />
                  </span>
               </div>
               <div className="border-line-100 border"></div>
               <div className="flex gap-3.5 lg:gap-4 [&_div]:flex [&_div]:items-center [&_div]:gap-2">
                  <div className="!hidden md:!flex">
                     <MoveTextCard text={t("moveDateLabel")} />
                     <span className="text-14-medium lg:text-18-medium">
                        <FormattedDateWithDay dateString={request.moveDate} />
                     </span>
                  </div>
                  <div>
                     <MoveTextCard text={t("departureLabel")} />
                     <span className="text-14-medium lg:text-18-medium">
                        {request.fromAddress.slice(0, 6)}
                     </span>
                  </div>
                  <div>
                     <MoveTextCard text={t("destinationLabel")} />
                     <span className="text-14-medium lg:text-18-medium">
                        {request.toAddress.slice(0, 6)}
                     </span>
                  </div>
               </div>
            </div>
         </div>

         <div className="border-line-100 border lg:hidden" />
         <div className="lg:hidden">
            <SocialShareGroup text={t("shareQuoteText")} />
         </div>
         <div className="border-line-100 border" />

         <div className="flex flex-col gap-4 lg:gap-6">
            <span className="text-16-semibold lg:text-24-semibold">
               {t("estimatePriceTitle")}
            </span>
            <p className="text-20-bold lg:text-32-bold">
               {Number(price).toLocaleString()} {t("money")}
            </p>
         </div>

         <div className="border-line-100 border" />

         <div>
            <PageTitle title={t("estimateInfoTitle")} />
            <ul className="bg-bg-100 border-line-100 [&_label]:text-14-regular [&_span]:text-14-regular [&_span]:lg:text-18-regular [&_label]:lg:text-18-regular mt-4 flex flex-col gap-2.5 rounded-2xl border px-5 py-4 lg:gap-4 lg:px-6 lg:py-5 [&_label]:min-w-16 [&_label]:text-gray-300 [&_label]:lg:min-w-22 [&_li]:flex [&_li]:items-center [&_li]:gap-10">
               <li>
                  <label>{t("labels.requestedAt")}</label>
                  <span>
                     <FormattedDateWithDay dateString={createdAt} />
                  </span>
               </li>
               <li>
                  <label>{t("labels.service")}</label>
                  <span>{t(`${request.moveType}`)}</span>
               </li>
               <li>
                  <label>{t("labels.from")}</label>
                  <span>{request.fromAddress}</span>
               </li>
               <li>
                  <label>{t("labels.to")}</label>
                  <span>{request.toAddress}</span>
               </li>
            </ul>
         </div>
      </>
   );
}
