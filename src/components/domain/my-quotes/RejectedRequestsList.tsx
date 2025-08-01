"use client";

import { useEffect, useState } from "react";
import { getRejectedEstimates } from "@/lib/api/estimate/requests/getRejectedEstimates";
import EmptyState from "@/components/common/EmptyState";
import QuoteCard from "./QuoteCard";
import { MyEstimateDetail } from "@/lib/types";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import RejectedRequestsSkeleton from "./RejectedRequestsSkeleton";

export default function RejectedRequestsList() {
   const [estimates, setEstimates] = useState<MyEstimateDetail[] | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         const response = await getRejectedEstimates();
         setEstimates(response?.data ?? []);
         setIsLoading(false);
      };

      fetchData();
   }, []);

   if (isLoading) {
      return (
         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
            <SkeletonLayout
               count={6}
               SkeletonComponent={RejectedRequestsSkeleton}
            />
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
            <EmptyState message="아직 반려한 견적이 없습니다." />
         )}
      </div>
   );
}
