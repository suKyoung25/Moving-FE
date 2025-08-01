"use client";

import { useEffect, useState } from "react";
import { getSentEstimates } from "@/lib/api/estimate/requests/getSentEstimates";
import EmptyState from "@/components/common/EmptyState";
import QuoteCard from "./QuoteCard";
import { MyEstimateDetail } from "@/lib/types";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import SentQuotesSkeleton from "./SentQuotesSkeleton";

export default function SentQuotesList() {
   const [estimates, setEstimates] = useState<MyEstimateDetail[] | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         const response = await getSentEstimates();
         setEstimates(response?.data ?? []);
         setIsLoading(false);
      };

      fetchData();
   }, []);

   if (isLoading) {
      return (
         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
            <SkeletonLayout count={6} SkeletonComponent={SentQuotesSkeleton} />
         </div>
      );
   }

   const hasEstimates = estimates && estimates.length > 0;

   return (
      <div>
         {hasEstimates ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
               {estimates.map((est) => (
                  <QuoteCard key={est.id} estimate={est} />
               ))}
            </div>
         ) : (
            <EmptyState message="아직 보낸 견적이 없습니다." />
         )}
      </div>
   );
}
