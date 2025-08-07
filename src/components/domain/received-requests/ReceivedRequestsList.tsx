"use client";

import { useEffect, useRef, useState } from "react";
import RequestCard from "./RequestCard";
import { ReceivedRequest, ReceivedRequestsProps } from "@/lib/types";
import { useReceivedRequestsQuery } from "@/lib/api/request/query";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import RequestCardSkeleton from "./RequestCardSkeleton";
import ToastPopup from "@/components/common/ToastPopup";
import { useTranslations } from "next-intl";

export default function ReceivedRequestsList({
   moveType,
   isDesignated,
   keyword,
   sort,
   onTotalCountChange,
   onLoadingChange,
}: ReceivedRequestsProps) {
   const t = useTranslations("ReceivedRequests");

   const observerRef = useRef<HTMLDivElement | null>(null);
   const [toast, setToast] = useState<{
      id: number;
      text: string;
      success: boolean;
   } | null>(null);

   const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      totalCount,
   } = useReceivedRequestsQuery({
      moveType,
      isDesignated,
      keyword,
      sort,
   });

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
                  <RequestCard key={req.id} req={req} setToast={setToast} />
               )),
            )}
         </div>
         <div className="py-4">
            <p ref={observerRef} />
            {isFetchingNextPage && (
               <p className="text-center text-gray-500">{t("loadingMore")}</p>
            )}
            {!hasNextPage && (
               <p className="text-center text-gray-400">
                  {t("noMoreRequests")}
               </p>
            )}
         </div>
         {toast && (
            <ToastPopup
               key={toast.id}
               text={toast.text}
               success={toast.success}
            />
         )}
      </>
   );
}
