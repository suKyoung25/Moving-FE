"use client";

import { DesignatedRequest, Estimate } from "@/lib/types";
import MoverProfileclient from "./MoverProfileClient";
import { useRouter } from "next/navigation";

interface ReceivedCardProps {
   estimate: Estimate;
   designated: DesignatedRequest[];
}

export default function ReceivedCard({
   estimate,
   designated,
}: ReceivedCardProps) {
   const router = useRouter();

   return (
      <div
         onClick={() => router.push(`client/${estimate.estimateId}`)}
         style={{
            boxShadow:
               "-2px -2px 10px rgba(220, 220, 220, 0.2), 2px 2px 10px rgba(220, 220, 220, 0.14)",
         }}
         className="flex w-full cursor-pointer flex-col gap-2 rounded-2xl bg-white px-3.5 pt-5 pb-3.5 lg:px-6 lg:pt-7 lg:pb-5.5"
      >
         <MoverProfileclient
            moveType={estimate.isConfirmed ? "DONE" : null}
            isDesignated={designated ? true : false}
            moverName={estimate.moverName}
            profileImage={estimate.profileImage}
            isFavorited={false}
            averageReviewRating={estimate.reviewRating}
            reviewCount={estimate.reviewCount}
            career={estimate.career}
            estimateCount={estimate.estimateCount}
            favoriteCount={estimate.favoriteCount}
            quotesStatus="received"
            comment={estimate.comment}
         />
         <div className="mt-4 flex items-center justify-end gap-2">
            <p className="text-14-medium lg:text-18-medium">견적금액</p>
            <p className="text-18-bold lg:text-24-bold">
               {estimate.price.toLocaleString()}원
            </p>
         </div>
      </div>
   );
}
