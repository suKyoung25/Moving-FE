import SocialShareGroup from "@/components/common/SocialShareGroup";
import PageTitle from "@/components/layout/PageTitle";
import { Suspense } from "react";
import ReceivedRequestDetailContent from "./ReceivedRequestDetailContent";
import ReceivedRequestDetailSkeleton from "./ReceivedRequestDetailSkeleton";

export default function ReceivedRequestDetail({ id }: { id: string }) {
   return (
      <div>
         <PageTitle title="요청 상세" />
         <div className="mt-4 lg:flex lg:gap-40">
            <article className="flex flex-col gap-6 lg:flex-1 lg:gap-10">
               <Suspense fallback={<ReceivedRequestDetailSkeleton />}>
                  <ReceivedRequestDetailContent id={id} />
               </Suspense>
            </article>
            <article className="hidden h-fit w-60 lg:block">
               <SocialShareGroup text="견적서 공유하기" />
            </article>
         </div>
      </div>
   );
}
