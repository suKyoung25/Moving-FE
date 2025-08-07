import React, { useState } from "react";
import QuotaionInfo from "./QuotaionInfo";
import Dropdown from "./Dropdown";
import ReceivedCard from "./ReceivedCard";
import { Estimate, RequestType } from "@/lib/types";
import { useTranslations } from "next-intl";

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
   const t = useTranslations("MyQuotes.Client");
   const [dropdownName, setDropdownName] = useState("all");

   const filteredEstimates =
      dropdownName === "confirmed"
         ? estimates.filter((e) => e.isConfirmed)
         : estimates;

   return (
      <section className="md:border-line-100 md:mx-auto md:w-150 md:rounded-3xl md:border md:px-8 md:py-4 md:shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.14),2px_2px_10px_0px_rgba(220,220,220,0.14)] lg:w-350 lg:px-10 lg:py-12">
         <p className="text-16-semibold lg:text-24-semibold mb-6 lg:mb-10">
            {t("estimateInfoTitle")}
         </p>
         <QuotaionInfo request={request} />
         <main className="mt-8 lg:mt-10.5">
            <p className="text-16-semibold lg:text-24-semibold mb-6 lg:mb-10">
               {t("estimateListTitle")}
            </p>
            <Dropdown
               selectedValue={dropdownName}
               setSelectedValue={setDropdownName}
               options={[
                  { label: t("dropdown.all"), value: "all" },
                  { label: t("dropdown.confirmed"), value: "confirmed" },
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
