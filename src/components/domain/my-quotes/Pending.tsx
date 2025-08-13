"use client";

import React, { useState } from "react";
import profile from "@/assets/images/profileIcon.svg";
import { useRouter } from "next/navigation";
import { ChipType } from "@/components/common/MoveChip";
import OutlinedButton from "@/components/common/OutlinedButton";
import { QuoteItem } from "@/lib/types";
import MoveDateCard from "./MoveDateCard";
import MoverProfileclient from "./MoverProfileClient";
import EmptyState from "@/components/common/EmptyState";
import { usePendingEstimates } from "@/lib/api/estimate/query";
import Pagination from "@/components/common/Pagination";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import ConfirmedButton from "./ConfirmedButton";
import { useLocale, useTranslations } from "next-intl";
import formatAddress from "@/lib/utils/formatAddress.util";
import PendingSkeleton from "./PendingSkeleton";

export default function Pending() {
   const t = useTranslations("MyQuotes.Client");
   const locale = useLocale();

   const [page, setPage] = useState(1);
   const router = useRouter();

   const { data, isLoading, isError } = usePendingEstimates(page, locale);

   if (isLoading)
      return (
         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <SkeletonLayout count={6} SkeletonComponent={PendingSkeleton} />
         </div>
      );

   if (isError || !data || data.data.length === 0) {
      return <EmptyState message={t("emptyMessage")} />;
   }

   return (
      <>
         <div className="text-black-300 flex flex-col gap-6 md:gap-8 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-10.5">
            {data.data.map(({ estimate, request }: QuoteItem) => (
               <section
                  key={estimate.estimateId}
                  className="mx-auto flex w-full flex-col gap-2 rounded-2xl bg-white px-3 pt-5 pb-3.5 shadow lg:mx-0 lg:w-172 lg:px-6 lg:pt-7 lg:pb-5.5"
               >
                  <div className="flex flex-col gap-3.5">
                     <MoverProfileclient
                        moveType={request.moveType as ChipType}
                        isDesignated={estimate.isDesignated}
                        moverName={estimate.moverName}
                        profileImage={estimate.profileImage || profile}
                        isFavorited={!!estimate.isFavorited}
                        moverId={estimate.moverId}
                        averageReviewRating={estimate.reviewRating}
                        reviewCount={estimate.reviewCount}
                        career={estimate.career | 0}
                        estimateCount={estimate.estimateCount}
                        favoriteCount={estimate.favoriteCount}
                        quotesStatus="pending"
                     />
                     <MoveDateCard
                        category={t("category.moveDate")}
                        text={new Date(request.moveDate).toLocaleDateString()}
                     />
                     <article className="flex items-center gap-3.5">
                        <MoveDateCard
                           category={t("category.from")}
                           text={formatAddress(request.fromAddress, locale)}
                        />
                        <div className="bg-line-200 h-3.5 w-px" />
                        <MoveDateCard
                           category={t("category.to")}
                           text={formatAddress(request.toAddress, locale)}
                        />
                     </article>
                  </div>
                  <div>
                     <p className="text-14-medium text-black-400 text-right">
                        {t("priceLabel")}{" "}
                        <span className="text-18-bold">
                           {estimate.price.toLocaleString()}
                           {t("money")}
                        </span>
                     </p>
                  </div>
                  <div className="flex flex-col gap-2 md:flex-row">
                     <ConfirmedButton estimateId={estimate.estimateId} />
                     <OutlinedButton
                        onClick={() =>
                           router.push(`client/${estimate.estimateId}`)
                        }
                     >
                        {t("buttons.viewDetails")}
                     </OutlinedButton>
                  </div>
               </section>
            ))}
         </div>
         <Pagination
            page={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
         />
      </>
   );
}
