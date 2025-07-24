"use client";

import { useEffect, useState } from "react";
import { Quotes } from "@/lib/types";
import { fetchClientReceivedQuotes } from "@/lib/api/estimate/getClientReceivedQuote";
import QuotaionInfo from "./QuotaionInfo";
import ReceivedCard from "./ReceivedCard";
import Dropdown from "./Dropdown";
import EmptyState from "@/components/common/EmptyState";

// 받았던 견적
export default function Received() {
   const [dropdownName, setDropdownName] = useState("all");
   const [data, setData] = useState<Quotes[]>();

   useEffect(() => {
      async function getMyReceivedQuotes() {
         try {
            const result = await fetchClientReceivedQuotes(dropdownName);
            setData(result.data);
         } catch (e) {
            throw e;
         }
      }

      getMyReceivedQuotes();
   }, [dropdownName]);

   if (!data) return <EmptyState message="기사님들이 열심히 확인 중이에요!" />;

   return (
      <div className="flex flex-col gap-2 md:gap-4 lg:gap-8">
         {data.map((d) => (
            <section
               key={d.requestId}
               className="md:border-line-100 md:mx-auto md:w-150 md:rounded-3xl md:border md:px-8 md:py-4 md:shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.14),2px_2px_10px_0px_rgba(220,220,220,0.14)] lg:w-350 lg:px-10 lg:py-12"
            >
               <QuotaionInfo
                  fromAddress={d.fromAddress}
                  moveDate={d.moveDate}
                  moveType={d.moveType}
                  toAddress={d.toAddress}
                  requestedAt={d.requestedAt}
               />
               <article className="mt-8 lg:mt-10.5">
                  <p className="text-16-semibold lg:text-24-semibold mb-6 lg:mb-10">
                     견적서 목록
                  </p>
                  <Dropdown
                     dropdownName={dropdownName}
                     setDropdownName={setDropdownName}
                  />
                  <main className="mt-4 flex flex-col gap-6 md:gap-8 lg:mt-8 lg:gap-14">
                     {d.estimates.map((estimate) => (
                        <ReceivedCard
                           key={estimate.estimateId}
                           estimate={estimate}
                           designated={d.designatedRequest}
                        />
                     ))}
                  </main>
               </article>
            </section>
         ))}
      </div>
   );
}
