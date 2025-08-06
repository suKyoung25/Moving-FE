"use client";

import { useEffect } from "react";
import { DataItem, GroupedByRequest } from "@/lib/types";
import EmptyState from "@/components/common/EmptyState";
import { useReceivedEstimates } from "@/lib/api/estimate/query";
import { useInView } from "react-intersection-observer";
import SentQuotesSkeleton from "./SentQuotesSkeleton";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import ReceivedSection from "./ReceivedSection";

function groupByRequest(data: DataItem[]): GroupedByRequest[] {
   const map = new Map<string, GroupedByRequest>();

   data.forEach((item) => {
      const requestId = item.request.requestId;
      if (!map.has(requestId)) {
         map.set(requestId, {
            request: item.request,
            estimates: [item.estimate],
         });
      } else {
         map.get(requestId)!.estimates.push(item.estimate);
      }
   });

   return Array.from(map.values());
}

// 받았던 견적
export default function Received() {
   const { ref, inView } = useInView();

   const {
      data,
      isLoading,
      isError,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = useReceivedEstimates("all");

   useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
         fetchNextPage();
      }
   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

   const allData = data?.pages.flatMap((page) => page.data) ?? [];

   if (isLoading)
      return (
         <SkeletonLayout count={6} SkeletonComponent={SentQuotesSkeleton} />
      );

   if (allData.length === 0 || isError)
      return <EmptyState message="기사님들이 열심히 확인 중이에요!" />;

   const groupedData: GroupedByRequest[] = groupByRequest(allData);

   return (
      <div className="flex flex-col gap-2 md:gap-4 lg:gap-8">
         {groupedData.map(({ request, estimates }, idx) => (
            <ReceivedSection
               key={idx}
               request={request}
               estimates={estimates}
               ref={ref}
            />
         ))}
         {isFetchingNextPage && <div>다음 페이지 불러오는 중...</div>}
      </div>
   );
}
