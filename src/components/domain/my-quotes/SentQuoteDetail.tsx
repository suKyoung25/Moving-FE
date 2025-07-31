import PageTitle from "@/components/layout/PageTitle";
import { getSentEstimateDetail } from "@/lib/api/estimate/requests/getSentEstimateDetail";
import { notFound } from "next/navigation";
import SocialShareGroup from "@/components/common/SocialShareGroup";
import SentQuoteDetailContent from "./SentQuoteDetailContent";
import { Suspense } from "react";
import SentQuoteDetailSkeleton from "./SentQuoteDetailSkeleton";

export default async function SentQuoteDetail({ id }: { id: string }) {
   const estimate = await getSentEstimateDetail(id);

   if (!estimate || !estimate.request) return notFound();

   return (
      <div>
         <PageTitle title="견적 상세" />
         <div className="mt-4 lg:flex lg:gap-40">
            <article className="flex flex-col gap-6 lg:flex-1 lg:gap-10">
               <Suspense fallback={<SentQuoteDetailSkeleton />}>
                  <SentQuoteDetailContent id={id} />
               </Suspense>
            </article>
            <article className="hidden h-fit w-60 lg:block">
               <SocialShareGroup text="견적서 공유하기" />
            </article>
         </div>
      </div>
   );
}
