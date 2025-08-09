import PageTitle from "@/components/layout/PageTitle";
import { getSentEstimateDetail } from "@/lib/api/estimate/requests/getSentEstimateDetail";
import { notFound } from "next/navigation";
import SocialShareGroup from "@/components/common/SocialShareGroup";
import SentQuoteDetailContent from "./SentQuoteDetailContent";
import { Suspense } from "react";
import SentQuoteDetailSkeleton from "./SentQuoteDetailSkeleton";
import { getTranslations } from "next-intl/server";

export default async function SentQuoteDetail({ id }: { id: string }) {
   const t = await getTranslations("MyQuotes.Mover.Detail");

   const estimate = await getSentEstimateDetail(id);

   if (!estimate || !estimate.request) return notFound();

   return (
      <div>
         <PageTitle title={t("pageTitle")} />
         <div className="mt-4 lg:flex lg:gap-40">
            <article className="flex flex-col gap-6 lg:flex-1 lg:gap-10">
               <Suspense fallback={<SentQuoteDetailSkeleton />}>
                  <SentQuoteDetailContent id={id} />
               </Suspense>
            </article>
            <article className="hidden h-fit w-60 lg:block">
               <SocialShareGroup text={t("shareQuoteText")} />
            </article>
         </div>
      </div>
   );
}
