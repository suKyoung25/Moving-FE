"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import PageTitle from "@/components/layout/PageTitle";
import MoverProfileclient from "@/components/domain/my-quotes/MoverProfileClient";
import QuotationInfo from "@/components/domain/my-quotes/QuotationInfo";
import { fetchClientQuoteDetail } from "@/lib/api/estimate/getClientQuoteDetail";
import SocialShareGroup from "@/components/common/SocialShareGroup";
import ConfirmedButton from "@/components/domain/my-quotes/ConfirmedButton";
import { useTranslations } from "next-intl";
import Spinner from "@/components/common/Spinner";

export default function MyQuotesDetailPage({
   params,
}: {
   params: Promise<{ id: string; locale: string }>;
}) {
   // Promise로 넘어온 params 해제
   const { id, locale } = use(params);

   const t = useTranslations("MyQuotes.Client.Detail");

   const [data, setData] = useState<
      Awaited<ReturnType<typeof fetchClientQuoteDetail>>["data"] | null
   >(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      (async () => {
         try {
            const res = await fetchClientQuoteDetail(id, locale);
            if (!res?.data) {
               notFound();
               return;
            }
            setData(res.data);
         } catch (err) {
            console.error(err);
            notFound();
         } finally {
            setLoading(false);
         }
      })();
   }, [id, locale]);

   if (loading) {
      return <Spinner />;
   }

   if (!data) return null;

   return (
      <div>
         <PageTitle title={t("pageTitle")} />
         <div className="item lg:flex lg:justify-between">
            <section className="items mt-2 mb-10 flex w-full flex-col gap-6 lg:mt-6 lg:max-w-238.5 lg:gap-10">
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
                     {t("estimatePriceTitle")}
                  </p>
                  <p className="text-20-bold lg:text-32-bold">
                     {data.price.toLocaleString()} {t("money")}
                  </p>
               </article>

               <hr className="bg-line-100 h-px border-0" />

               <article className="lg:hidden">
                  <SocialShareGroup text={t("shareQuoteText")} />
               </article>

               <hr className="bg-line-100 h-px border-0 lg:hidden" />

               <p className="text-16-semibold lg:text-24-semibold">
                  {t("estimateInfoTitle")}
               </p>
               <QuotationInfo request={data.request} />
            </section>

            {/* 하단 버튼 (모바일) */}
            <div className="bottom-0 left-0 flex w-full items-center gap-2 bg-white lg:hidden">
               {data.status === "pending" && (
                  <ConfirmedButton estimateId={data.id} />
               )}
            </div>

            {/* 우측 영역 (데스크탑) */}
            <div className="hidden w-82 lg:block">
               {data.status === "pending" && (
                  <>
                     <ConfirmedButton estimateId={data.id} />
                     <hr className="bg-line-100 my-10 h-px border-0" />
                  </>
               )}

               <article>
                  <SocialShareGroup text={t("shareQuoteText")} />
               </article>
            </div>
         </div>
      </div>
   );
}
