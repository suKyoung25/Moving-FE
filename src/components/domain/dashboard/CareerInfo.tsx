"use client";

import Image from "next/image";
import React from "react";
import yellowStar from "@/assets/images/starFilledIcon.svg";
import LineDivider from "@/components/common/LineDivider";
import { Mover } from "@/lib/types";
import { useTranslations } from "next-intl";

interface CareerInfoProps {
   averageReviewRating: Mover["averageReviewRating"];
   reviewCount: Mover["reviewCount"];
   career: Mover["career"];
   estimateCount: Mover["estimateCount"];
}

const grayText = "text-gray-300";

export default function CareerInfo({
   averageReviewRating,
   reviewCount,
   career,
   estimateCount,
}: CareerInfoProps) {
   const t = useTranslations("Dashboard");

   return (
      <div className="flex items-center">
         {/* 평점 */}
         <div className="flex gap-0.5 lg:gap-1.5">
            <Image
               src={yellowStar}
               alt={t("rating")}
               className="aspect-square w-5 lg:w-6"
            />
            <span>{averageReviewRating.toFixed(1)}</span>
            <span className={grayText}>({reviewCount})</span>
         </div>
         <LineDivider isVertical={true} className="lg:mx-4" />

         {/* 경력 */}
         <div className="flex gap-1 lg:gap-1.5">
            <span className={grayText}>{t("career")}</span>
            <span>
               {career}
               {t("years")}
            </span>
         </div>
         <LineDivider isVertical={true} className="lg:mx-4" />

         {/* 확정된 견적 수 */}
         <div className="flex gap-1 lg:gap-1.5">
            <span>
               {estimateCount}
               {t("count")}
            </span>
            <span className={grayText}>{t("confirmed")}</span>
         </div>
      </div>
   );
}
