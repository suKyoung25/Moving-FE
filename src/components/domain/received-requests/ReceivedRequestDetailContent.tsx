import MoveChip from "@/components/common/MoveChip";
import { getReceivedRequestDetail } from "@/lib/api/request/requests/getReceivedRequestDetail";
import { notFound } from "next/navigation";
import MoveTextCard from "../my-quotes/MoveTextCard";
import SocialShareGroup from "@/components/common/SocialShareGroup";
import PageTitle from "@/components/layout/PageTitle";
import { getTranslations } from "next-intl/server";
import FormattedDateWithDay from "@/components/common/FormattedDateWithDay";

export default async function ReceivedRequestDetailContent({
   id,
}: {
   id: string;
}) {
   const t = await getTranslations("ReceivedRequests.Detail");

   const { request } = await getReceivedRequestDetail(id);

   console.log(request);
   if (!request) return notFound();
   return (
      <>
         <div className="border-line-100 rounded-2xl border bg-white px-3.5 py-4 lg:px-6 lg:py-5">
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-2 lg:gap-3">
                  <MoveChip type={request.moveType} />
                  {request.isDesignated && <MoveChip type="DESIGNATED" />}
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

         <div>
            <PageTitle title={t("estimateInfoTitle")} />
            <ul className="bg-bg-100 border-line-100 [&_label]:text-14-regular [&_span]:text-14-regular [&_span]:lg:text-18-regular [&_label]:lg:text-18-regular mt-4 flex flex-col gap-2.5 rounded-2xl border px-5 py-4 lg:gap-4 lg:px-6 lg:py-5 [&_label]:min-w-16 [&_label]:text-gray-300 [&_label]:lg:min-w-22 [&_li]:flex [&_li]:items-center [&_li]:gap-10">
               <li>
                  <label>{t("labels.requestedAt")}</label>
                  <span>{request.requestedAt.slice(0, 10)}</span>
               </li>
               <li>
                  <label>{t("labels.service")}</label>
                  <span>
                     {" "}
                     {t(`moveTypes.${request.moveType}`)} {t("estimateSuffix")}
                  </span>
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
