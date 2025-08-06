"use client";

import { useEffect, useRef, useState } from "react";
import { Quotes } from "@/lib/types";
import QuotaionInfo from "./QuotaionInfo";
import Dropdown from "./Dropdown";
import EmptyState from "@/components/common/EmptyState";
import { isAfter } from "date-fns";
import { useRouter } from "next/navigation";
import { useRequestsQuery } from "@/lib/api/estimate/query";
import { cancelRequest } from "@/lib/api/estimate/requests/cancelRequest";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/context/ToastConText";

// 요청한 견적
export default function Requested() {
   const [dropdownName, setDropdownName] = useState("recent");
   const { showSuccess, showError } = useToast();
   const router = useRouter();
   const bottomRef = useRef<HTMLDivElement | null>(null);

   const sort = dropdownName === "recent" ? "desc" : "asc";
   const queryClient = useQueryClient();

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
      const confirmed = request.estimates.find(
         (e) => e.isClientConfirmed === true,
      );

      if (confirmed) {
         router.push(`/my-quotes/client/${confirmed.id}`);
      } else {
         showError("확정된 견적이 없어요!");
      }
   };

   const handleCancel = async (requestId: string) => {
      try {
         const { data } = await cancelRequest(requestId);
         console.log(data);
         queryClient.invalidateQueries({ queryKey: ["requests", sort] });
         queryClient.invalidateQueries({ queryKey: ["activeRequest"] });
         showSuccess("견적 요청이 취소되었어요");
      } catch (error) {
         console.error("견적 요청 취소 실패:", error);
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

   if (isLoading) return <div>로딩중...</div>;

   if (requests.length === 0)
      return <EmptyState message="아직 보낸 요청이 없어요!" />;

   return (
      <section className="flex flex-col gap-2 md:gap-4 lg:gap-8">
         <h2 className="text-18-semibold lg:text-24-semibold flex items-center justify-between">
            견적 요청 목록
            <Dropdown
               selectedValue={dropdownName}
               setSelectedValue={setDropdownName}
               options={[
                  { label: "최근 요청순", value: "recent" },
                  { label: "오래된 요청순", value: "oldest" },
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
                  <div key={request.id}>
                     <p className="text-16-semibold lg:text-24-semibold mb-6 lg:mb-10">
                        요청 정보
                     </p>
                     {!request.isPending ? (
                        <div
                           key={request.id}
                           onClick={() => handleClick(request)}
                           className="cursor-pointer"
                        >
                           <QuotaionInfo
                              request={request}
                              chipType={chipType}
                           />
                        </div>
                     ) : (
                        <QuotaionInfo
                           request={request}
                           chipType={chipType}
                           isPending={true}
                           onClick={() => handleCancel(request.id)}
                        />
                     )}
                  </div>
               );
            })}
         </article>
         <div ref={bottomRef} />
         {isFetchingNextPage && (
            <div className="text-16-medium max-lg:text-12-medium py-4 text-center text-gray-400">
               불러오는 중...
            </div>
         )}
      </section>
   );
}
