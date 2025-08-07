import SocialShareGroup from "@/components/common/SocialShareGroup";
import PageTitle from "@/components/layout/PageTitle";
import { Suspense } from "react";
import ReceivedRequestDetailContent from "./ReceivedRequestDetailContent";
import ReceivedRequestDetailSkeleton from "./ReceivedRequestDetailSkeleton";
import { getTranslations } from "next-intl/server";

export default async function ReceivedRequestDetail({ id }: { id: string }) {
   const t = await getTranslations("ReceivedRequests.Detail");

   return (
      <div>
         <PageTitle title={t("pageTitle")} />
         <div className="mt-4 lg:flex lg:gap-40">
            <article className="flex flex-col gap-6 lg:flex-1 lg:gap-10">
               <Suspense fallback={<ReceivedRequestDetailSkeleton />}>
                  <ReceivedRequestDetailContent id={id} />
               </Suspense>
            </article>
            <article className="hidden h-fit w-60 lg:block">
               <SocialShareGroup text={t("shareQuoteText")} />
            </article>
         </div>
      </div>
   );
}
