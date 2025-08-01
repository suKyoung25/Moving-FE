"use client";

import { useState } from "react";
import { useSentEstimates } from "@/lib/api/estimate/query";
import QuoteCard from "./QuoteCard";
import Pagination from "@/components/common/pagination";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import SentQuotesSkeleton from "./SentQuotesSkeleton";
import EmptyState from "@/components/common/EmptyState";
import { MyEstimateDetail } from "@/lib/types";

export default function SentQuotesList() {
   const [page, setPage] = useState(1);
   const { data, isLoading } = useSentEstimates(page);

   const estimates = data?.data ?? [];
   const totalPages = data?.totalPages ?? 1;
   const hasEstimates = estimates.length > 0;

   return (
      <div>
         {/* 카드 영역 */}
         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
            {isLoading ? (
               <SkeletonLayout
                  count={6}
                  SkeletonComponent={SentQuotesSkeleton}
               />
            ) : hasEstimates ? (
               estimates.map((est: MyEstimateDetail) => (
                  <QuoteCard key={est.id} estimate={est} />
               ))
            ) : (
               <EmptyState message="아직 보낸 견적이 없습니다." />
            )}
         </div>

         {/* 페이지네이션 항상 표시 */}
         <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
         />
      </div>
   );
}
