"use client";

import React from "react";
import { Mover } from "@/lib/types";
import CareerInfo from "./CareerInfo";
import LineDivider from "@/components/common/LineDivider";
import { Region } from "@/lib/types";
import { useTranslations } from "next-intl";

interface MoverInfoProps {
   averageReviewRating: Mover["averageReviewRating"];
   reviewCount: Mover["reviewCount"];
   estimateCount: Mover["estimateCount"];
   career: Mover["career"];
   serviceType: Mover["serviceType"];
   serviceArea: Region[];
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
   const t = useTranslations("Dashboard");

   // serviceArea 배열을 번역된 문자열 배열로 변환
   const translatedServiceType = serviceType
      ?.map((type) => t(`moveTypes.${type}`))
      .filter(Boolean);

   // serviceArea 배열을 번역된 문자열 배열로 변환
   const translatedServiceArea = serviceArea
      ?.map((area) => t(`regions.${area}`))
      .filter(Boolean);

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
               <span className={serviceClass}>{t("providedServices")}</span>
               <span>{translatedServiceType?.join(", ")}</span>
            </div>
            <div className="max-md:hidden md:block">
               <LineDivider isVertical={true} />
            </div>
            <div>
               <span className={serviceClass}>{t("region")}</span>
               <span>{translatedServiceArea?.join(", ")}</span>
            </div>
         </div>
      </div>
   );
}
