"use client";

import { useEffect, useRef, useState } from "react";
import { Quotes } from "@/lib/types";
import QuotaionInfo from "./QuotaionInfo";
import Dropdown from "./Dropdown";
import EmptyState from "@/components/common/EmptyState";
import { isAfter } from "date-fns";
import { useRouter } from "next/navigation";
import ToastPopup from "@/components/common/ToastPopup";
import { useRequestsQuery } from "@/lib/api/estimate/query";
import { useTranslations } from "next-intl";

// 요청한 견적
export default function Requested() {
   const t = useTranslations("MyQuotes.Client");

   const [dropdownName, setDropdownName] = useState("recent");
   const [toast, setToast] = useState<{
      id: number;
      text: string;
      success: boolean;
   } | null>(null);

   const router = useRouter();
   const bottomRef = useRef<HTMLDivElement | null>(null);

   const sort = dropdownName === "recent" ? "desc" : "asc";
   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
      useRequestsQuery(sort);
   const requests = data?.pages.flatMap((page) => page.requests) ?? [];

   const chipTypeMap = (moveDate: Date, isPending: boolean) => {
      const now = new Date();

      if (isPending) {
         return isAfter(moveDate, now) ? "PENDING" : "MATCHING_FAILED";
      } else {
         return isAfter(moveDate, now) ? "MATCHING_SUCCESS" : "DONE";
      }
   };

   const handleClick = (request: Quotes) => {
      if (!request.estimates || request.estimates.length === 0) {
         setToast({
            id: Date.now(),
            text: t("toast.noReceivedEstimates"),
            success: false,
         });
         return;
      }

      const confirmed = request.estimates.find(
         (e) => e.isClientConfirmed === true,
      );

      if (confirmed) {
         router.push(`/my-quotes/client/${confirmed.id}`);
      } else {
         setToast({
            id: Date.now(),
            text: t("toast.noConfirmedEstimate"),
            success: false,
         });
      }
   };

   useEffect(() => {
      if (!bottomRef.current) return;
      const observer = new IntersectionObserver(
         (entries) => {
            if (
               entries[0].isIntersecting &&
               hasNextPage &&
               !isFetchingNextPage
            ) {
               fetchNextPage();
            }
         },
         { threshold: 1.0 },
      );

      const current = bottomRef.current;
      observer.observe(current);

      return () => observer.unobserve(current);
   }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

   if (isLoading) return <div>{t("loading")}</div>;

   if (requests.length === 0)
      return <EmptyState message={t("emptyRequestMessage")} />;

   return (
      <section className="flex flex-col gap-2 md:gap-4 lg:gap-8">
         <h2 className="text-18-semibold lg:text-24-semibold flex items-center justify-between">
            {t("title")}
            <Dropdown
               selectedValue={dropdownName}
               setSelectedValue={setDropdownName}
               options={[
                  { label: t("dropdown.recent"), value: "recent" },
                  { label: t("dropdown.oldest"), value: "oldest" },
               ]}
            />
         </h2>
         <article className="mt-4 flex flex-col gap-6 md:gap-8 lg:mt-8 lg:gap-14">
            {requests.map((request) => {
               const chipType = chipTypeMap(
                  new Date(request.moveDate),
                  request.isPending!,
               );

               return (
                  <div
                     key={request.id}
                     onClick={() => handleClick(request)}
                     className="cursor-pointer"
                  >
                     <QuotaionInfo
                        fromAddress={request.fromAddress}
                        moveDate={request.moveDate}
                        moveType={request.moveType}
                        toAddress={request.toAddress}
                        requestedAt={request.requestedAt}
                        chipType={chipType}
                        isRequestedTap={true}
                     />
                  </div>
               );
            })}
         </article>
         <div ref={bottomRef} />
         {isFetchingNextPage && (
            <div className="text-16-medium max-lg:text-12-medium py-4 text-center text-gray-400">
               {t("loadingMore")}
            </div>
         )}
         {toast && (
            <ToastPopup
               key={toast.id}
               text={toast.text}
               success={toast.success}
            />
         )}
      </section>
   );
}
