"use client";

import { useEffect, useState } from "react";
import { DataItem, GroupedByRequest } from "@/lib/types";
import QuotaionInfo from "./QuotaionInfo";
import ReceivedCard from "./ReceivedCard";
import Dropdown from "./Dropdown";
import EmptyState from "@/components/common/EmptyState";
import { useReceivedEstimates } from "@/lib/api/estimate/query";
import { useInView } from "react-intersection-observer";
import SentQuotesSkeleton from "./SentQuotesSkeleton";
import SkeletonLayout from "@/components/common/SkeletonLayout";

function groupByRequest(data: DataItem[]): GroupedByRequest[] {
   const map = new Map<string, GroupedByRequest>();

   data.forEach((item) => {
      const requestId = item.request.id;
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
   const [dropdownName, setDropdownName] = useState("all");
   const { ref, inView } = useInView();

   const {
      data,
      isLoading,
      isError,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = useReceivedEstimates(dropdownName);

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
            <section
               key={idx}
               className="md:border-line-100 md:mx-auto md:w-150 md:rounded-3xl md:border md:px-8 md:py-4 md:shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.14),2px_2px_10px_0px_rgba(220,220,220,0.14)] lg:w-350 lg:px-10 lg:py-12"
            >
               <QuotaionInfo
                  fromAddress={request.fromAddress}
                  moveDate={String(request.moveDate)}
                  moveType={request.moveType}
                  toAddress={request.toAddress}
                  requestedAt={String(request.requestedAt)}
               />
               <main className="mt-8 lg:mt-10.5">
                  <p className="text-16-semibold lg:text-24-semibold mb-6 lg:mb-10">
                     견적서 목록
                  </p>
                  <Dropdown
                     selectedValue={dropdownName}
                     setSelectedValue={setDropdownName}
                     options={[
                        { label: "전체", value: "all" },
                        { label: "확정한 견적서", value: "confirmed" },
                     ]}
                  />
               </main>
               <main className="mt-4 flex flex-col gap-6 md:gap-8 lg:mt-8 lg:gap-14">
                  {estimates.map((estimate, idx) => {
                     const isLast = idx === allData.length - 1;
                     return (
                        <span
                           key={estimate.estimateId}
                           ref={isLast ? ref : undefined}
                        >
                           <ReceivedCard
                              estimate={estimate}
                              designated={request.designatedRequest}
                              serviceType={request.moveType}
                           />
                        </span>
                     );
                  })}
               </main>
            </section>
         ))}
         {isFetchingNextPage && <div>다음 페이지 불러오는 중...</div>}
      </div>
   );
}
