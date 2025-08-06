import React, { useState } from "react";
import QuotaionInfo from "./QuotaionInfo";
import Dropdown from "./Dropdown";
import ReceivedCard from "./ReceivedCard";
import { Estimate, RequestType } from "@/lib/types";

interface ReceivedSectionProps {
   request: RequestType;
   estimates: Estimate[];
   ref: React.Ref<HTMLSpanElement> | null;
}

export default function ReceivedSection({
   request,
   estimates,
   ref,
}: ReceivedSectionProps) {
   const [dropdownName, setDropdownName] = useState("all");

   const filteredEstimates =
      dropdownName === "confirmed"
         ? estimates.filter((e) => e.isConfirmed)
         : estimates;

   return (
      <section className="md:border-line-100 md:mx-auto md:w-150 md:rounded-3xl md:border md:px-8 md:py-4 md:shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.14),2px_2px_10px_0px_rgba(220,220,220,0.14)] lg:w-350 lg:px-10 lg:py-12">
         <p className="text-16-semibold lg:text-24-semibold mb-6 lg:mb-10">
            견적 정보
         </p>
         <QuotaionInfo request={request} />
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
            {filteredEstimates.map((estimate, idx) => {
               const isLastOfGroup = idx === estimates.length - 1;
               return (
                  <span
                     key={estimate.estimateId}
                     ref={isLastOfGroup ? ref : undefined}
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
   );
}
