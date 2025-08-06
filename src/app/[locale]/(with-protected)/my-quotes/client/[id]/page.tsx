import PageTitle from "@/components/layout/PageTitle";
import MoverProfileclient from "@/components/domain/my-quotes/MoverProfileClient";
import QuotaionInfo from "@/components/domain/my-quotes/QuotaionInfo";
import { fetchClientQuoteDetail } from "@/lib/api/estimate/getClientQuoteDetail";
import SocialShareGroup from "@/components/common/SocialShareGroup";
import ConfirmedButton from "@/components/domain/my-quotes/ConfirmedButton";

// 견적 관리 상세
export default async function MyQuoetesDetailPage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = await params;

   const { data } = await fetchClientQuoteDetail(id);

   return (
      <div>
         <PageTitle title="견적 상세" />
         <div className="item flex justify-between">
            <section className="items mt-2 mb-27 flex w-full flex-col gap-6 lg:mt-6 lg:max-w-238.5 lg:gap-10">
               <article className="border-line-100 rounded-2xl border bg-white px-3.5 py-4 lg:px-6 lg:py-5">
                  <MoverProfileclient
                     moveType={data.request.moveType}
                     isDesignated={false}
                     moverName={data.mover.name}
                     profileImage={data.mover.profileImage}
                     isFavorited={data.isFavorite}
                     averageReviewRating={data.mover.averageReviewRating}
                     reviewCount={data.mover.reviewCount}
                     career={data.mover.career}
                     estimateCount={data.mover.estimateCount}
                     favoriteCount={data.mover.favoriteCount}
                     quotesStatus={data.status}
                     moverId={data.mover.id}
                     comment={data.comment}
                  />
               </article>
               <hr className="bg-line-100 h-px border-0" />
               <article>
                  <p className="text-16-semibold lg:text-24-semibold mb-4">
                     견적가
                  </p>
                  <p className="text-20-bold lg:text-32-bold">
                     {data.price.toLocaleString()}원
                  </p>
               </article>
               <hr className="bg-line-100 h-px border-0" />
               <article className="lg:hidden">
                  <SocialShareGroup text="견적서 공유하기" />
               </article>
               <hr className="bg-line-100 h-px border-0 lg:hidden" />
               <p className="text-16-semibold lg:text-24-semibold">견적 정보</p>
               <QuotaionInfo request={data.request} />
            </section>
            <div
               style={{ boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.16)" }}
               className="fixed bottom-0 left-0 flex w-full items-center gap-2 bg-white px-6 py-2.5 md:px-16 lg:hidden"
            >
               {data.status === "pending" && (
                  <ConfirmedButton estimateId={data.id} />
               )}
            </div>
            <div className="hidden w-82 lg:block">
               {data.status === "pending" && (
                  <>
                     <ConfirmedButton estimateId={data.id} />
                     <hr className="bg-line-100 my-10 h-px border-0" />
                  </>
               )}

               <article>
                  <SocialShareGroup text="견적서 공유하기" />
               </article>
            </div>
         </div>
      </div>
   );
}
