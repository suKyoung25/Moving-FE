"use client";

import EmptyState from "@/components/common/EmptyState";
import QuoteCard from "./QuoteCard";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import RejectedRequestsSkeleton from "./RejectedRequestsSkeleton";
import { useState } from "react";
import { MyEstimateDetail } from "@/lib/types";
import Pagination from "@/components/common/pagination";
import { useRejectedEstimates } from "@/lib/api/estimate/query";

export default function RejectedRequestsList() {
   const [page, setPage] = useState(1);
   const { data, isLoading } = useRejectedEstimates(page);

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
                  SkeletonComponent={RejectedRequestsSkeleton}
               />
            ) : hasEstimates ? (
               estimates.map((est: MyEstimateDetail) => (
                  <QuoteCard key={est.id} estimate={est} />
               ))
            ) : (
               <EmptyState message="아직 반려한 견적이 없습니다." />
            )}
         </div>
         <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
         />
      </div>
   );
}
