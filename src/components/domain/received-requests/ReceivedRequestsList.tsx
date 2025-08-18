"use client";

import { useEffect, useRef } from "react";
import RequestCard from "./RequestCard";
import { ReceivedRequest, ReceivedRequestsProps } from "@/lib/types";
import { useReceivedRequestsQuery } from "@/lib/api/request/query";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import RequestCardSkeleton from "./RequestCardSkeleton";
import { useLocale, useTranslations } from "next-intl";
import SearchSpinner from "../mover-search/MoverSearchSpinner";

export default function ReceivedRequestsList({
   moveType,
   isDesignated,
   keyword,
   sort,
   onTotalCountChange,
   onLoadingChange,
}: ReceivedRequestsProps) {
   const t = useTranslations("ReceivedRequests");
   const locale = useLocale();

   const observerRef = useRef<HTMLDivElement | null>(null);

   const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      totalCount,
   } = useReceivedRequestsQuery(
      {
         moveType,
         isDesignated,
         keyword,
         sort,
      },
      locale,
   );

   useEffect(() => {
      if (onTotalCountChange) onTotalCountChange(totalCount);
   }, [totalCount, onTotalCountChange]);

   useEffect(() => {
      onLoadingChange?.(isLoading);
   }, [isLoading, onLoadingChange]);

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
      return (
         <div className="flex flex-col gap-6 md:gap-8 lg:gap-12">
            <SkeletonLayout count={6} SkeletonComponent={RequestCardSkeleton} />
         </div>
      );
   }

   return (
      <>
         <div className="flex flex-col gap-6 md:gap-8 lg:gap-12">
            {data?.pages.map((page) =>
               (page as { requests: ReceivedRequest[] }).requests.map((req) => (
                  <RequestCard key={req.id} req={req} />
               )),
            )}
         </div>
         <div className="py-4">
            <p ref={observerRef} />
            {isFetchingNextPage && (
               <div className="flex w-full justify-center">
                  <SearchSpinner />
               </div>
            )}
            {!hasNextPage && (
               <p className="text-center text-gray-400">
                  {t("noMoreRequests")}
               </p>
            )}
         </div>
      </>
   );
}
