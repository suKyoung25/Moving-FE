"use client";

import { useEffect, useRef } from "react";
import RequestCard from "./RequestCard";
import { ReceivedRequest, ReceivedRequestsProps } from "@/lib/types";
import { useReceivedRequestsQuery } from "@/lib/api/request/query";

export default function ReceivedRequestsList({
   moveType,
   isDesignated,
   keyword,
   sort,
}: ReceivedRequestsProps) {
   const observerRef = useRef<HTMLDivElement | null>(null);

   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
      useReceivedRequestsQuery({
         moveType,
         isDesignated,
         keyword,
         sort,
      });

   useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
         if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
         }
      });

      if (observerRef.current) observer.observe(observerRef.current);
      return () => observer.disconnect();
   }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

   if (isLoading) {
      return <p className="mt-4 text-center text-gray-500">불러오는 중...</p>;
   }

   return (
      <>
         {data?.pages.map((page) =>
            page.requests.map((req: ReceivedRequest) => (
               <RequestCard key={req.id} req={req} />
            )),
         )}
         <div ref={observerRef} className="h-10" />
         {isFetchingNextPage && (
            <p className="mt-4 text-center text-gray-500">불러오는 중...</p>
         )}
         {!hasNextPage && (
            <p className="mt-4 text-center text-gray-400">
               마지막 페이지입니다.
            </p>
         )}
      </>
   );
}
