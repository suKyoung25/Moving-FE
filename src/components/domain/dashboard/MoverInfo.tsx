import React from "react";
import { Mover } from "@/lib/types";
import CareerInfo from "./CareerInfo";
import LineDivider from "@/components/common/LineDivider";
import { MOVE_TYPES } from "@/constants";

interface MoverInfoProps {
   averageReviewRating: Mover["averageReviewRating"];
   reviewCount: Mover["reviewCount"];
   estimateCount: Mover["estimateCount"];
   career: Mover["career"];
   serviceType: Mover["serviceType"];
   serviceArea: string[];
}

const serviceClass =
   "text-gray-400 px-[6px] py-0.5 lg:py-1 bg-bg-200 border border-line-100 rounded-sm mr-2";

export default function MoverInfo({
   averageReviewRating,
   reviewCount,
   estimateCount,
   career,
   serviceType,
   serviceArea,
}: MoverInfoProps) {
   const serviceTypeMap = Object.entries(MOVE_TYPES).map(([label, value]) => ({
      label,
      value,
   }));

   return (
      <div className="text-black-300 flex flex-col gap-[14px] font-medium max-lg:text-sm lg:gap-4">
         <CareerInfo
            averageReviewRating={averageReviewRating}
            reviewCount={reviewCount}
            career={career}
            estimateCount={estimateCount}
         />
         <div className="flex gap-2 max-md:flex-col max-md:justify-center md:items-center lg:text-lg">
            <div>
               <span className={serviceClass}>제공 서비스</span>
               <span>
                  {serviceType &&
                     serviceType
                        .map(
                           (type) =>
                              serviceTypeMap.find((item) => item.value === type)
                                 ?.label,
                        )
                        .filter(Boolean)
                        .join(", ")}
               </span>
            </div>
            <div className="max-md:hidden md:block">
               <LineDivider isVertical={true} />
            </div>
            <div>
               <span className={serviceClass}>지역</span>
               <span>{serviceArea && serviceArea.join(", ")}</span>
            </div>
         </div>
      </div>
   );
}
