import Image from "next/image";
import React from "react";
import yellowStar from "@/assets/images/starFilledIcon.svg";
import LineDivider from "@/components/common/LineDivider";
import { Mover } from "@/lib/types";

interface CareerInfoProps {
   // averageReviewRating: Mover["averageReviewRating"]; //TODO: 타입에러 나서 주석처리함. 아래도 마찬가지
   reviewCount: Mover["reviewCount"];
   career: Mover["career"];
   estimateCount: Mover["estimateCount"];
}

const grayText = "text-gray-300";

export default function CareerInfo({
   // averageReviewRating,
   reviewCount,
   career,
   estimateCount,
}: CareerInfoProps) {
   return (
      <div className="flex items-center">
         {/* 평점 */}
         <div className="flex gap-0.5 lg:gap-1.5">
            <Image
               src={yellowStar}
               alt="평점"
               className="aspect-square w-5 lg:w-6"
            />
            {/* <span>{averageReviewRating.toFixed(1)}</span> */}
            <span className={grayText}>({reviewCount})</span>
         </div>
         <LineDivider isVertical={true} className="lg:mx-4" />

         {/* 경력 */}
         <div className="flex gap-1 lg:gap-1.5">
            <span className={grayText}>경력</span>
            <span>{career}년</span>
         </div>
         <LineDivider isVertical={true} className="lg:mx-4" />

         {/* 확정된 견적 수 */}
         <div className="flex gap-1 lg:gap-1.5">
            <span>{estimateCount}건</span>
            <span className={grayText}>확정</span>
         </div>
      </div>
   );
}
