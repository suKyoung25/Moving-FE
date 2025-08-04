"use client";

import { useEffect, useState } from "react";
import { Quotes } from "@/lib/types";
import QuotaionInfo from "./QuotaionInfo";
import Dropdown from "./Dropdown";
import EmptyState from "@/components/common/EmptyState";
import { getRequests } from "@/lib/api/estimate/requests/getClientRequest";
import { isAfter } from "date-fns";
import { useRouter } from "next/navigation";
import ToastPopup from "@/components/common/ToastPopup";

// 요청한 견적
export default function Requested() {
   const [dropdownName, setDropdownName] = useState("all");
   const [data, setData] = useState<Quotes[]>();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const router = useRouter();

   const [toast, setToast] = useState<{
      id: number;
      text: string;
      success: boolean;
   } | null>(null);

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
            text: "받은 견적이 없어요!",
            success: false,
         });
         return;
      }

      const confirmed = request.estimates.find(
         (e) => e.isClientConfirmed === true,
      );

      console.log(confirmed);

      if (confirmed) {
         router.push(`/my-quotes/client/${confirmed.id}`);
      } else {
         setToast({
            id: Date.now(),
            text: "확정된 견적이 없어요!",
            success: false,
         });
      }
   };

   useEffect(() => {
      async function getMyReceivedQuotes() {
         try {
            setIsLoading(true);
            const result = await getRequests();
            setData(result.data);
            setIsLoading(false);
         } catch (e) {
            throw e;
         }
      }

      getMyReceivedQuotes();
   }, [dropdownName]);

   if (isLoading) return <div>로딩중...</div>;

   if (!data || data.length === 0)
      return <EmptyState message="아직 보낸 요청이 없어요!" />;

   return (
      <section className="flex flex-col gap-2 md:gap-4 lg:gap-8">
         <h2 className="text-18-semibold lg:text-24-semibold flex items-center justify-between">
            견적 요청 목록
            <Dropdown
               dropdownName={dropdownName}
               setDropdownName={setDropdownName}
            />
         </h2>
         <article className="mt-4 flex flex-col gap-6 md:gap-8 lg:mt-8 lg:gap-14">
            {data.map((d, idx) => {
               const chipType = chipTypeMap(new Date(d.moveDate), d.isPending!);

               return (
                  <div
                     key={idx}
                     onClick={() => handleClick(d)}
                     className="cursor-pointer"
                  >
                     <QuotaionInfo
                        fromAddress={d.fromAddress}
                        moveDate={d.moveDate}
                        moveType={d.moveType}
                        toAddress={d.toAddress}
                        requestedAt={d.requestedAt}
                        chipType={chipType}
                        isRequestedTap={true}
                     />
                  </div>
               );
            })}
         </article>
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
