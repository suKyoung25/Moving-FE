import { Review } from "@/lib/types";
import React from "react";

interface ReviewBreakdownProps {
   reviews: Review[];
}

export default function ReviewBreakdown({ reviews }: ReviewBreakdownProps) {
   /**
    * acc: 누적합, score: 현재값
    * 각 점수별 리뷰 개수 누적해서 reviewStats에 저장
    */
   const stats = reviews.reduce(
      (acc, review) => {
         const rating = review.rating;
         acc[rating] = (acc[rating] || 0) + 1;
         return acc;
      },
      {} as Record<number, number>,
   );

   const fullStats = [5, 4, 3, 2, 1].reduce(
      (acc, score) => {
         acc[score] = stats[score] ?? 0;
         return acc;
      },
      {} as Record<number, number>,
   );

   const total = reviews.length;

   return (
      <div className="flex flex-col lg:gap-[14px]">
         {Object.entries(fullStats)
            .sort((a, b) => Number(b[0]) - Number(a[0]))
            .map(([scoreString, count]) => {
               const score = Number(scoreString);
               const percent = total === 0 ? 0 : (count / total) * 100;

               return (
                  <div
                     key={score}
                     className="my-1 flex items-center gap-4 text-sm font-medium lg:gap-[30px] lg:text-xl"
                  >
                     <span className={`w-9 ${score === 5 && "font-bold"}`}>
                        {score}점
                     </span>
                     <div className="bg-bg-300 relative h-2 w-44 rounded-full lg:w-96">
                        <div
                           className="bg-secondary-yellow-100 absolute top-0 left-0 h-2 rounded-full"
                           style={{ width: `${percent}%` }}
                        />
                     </div>
                     <span
                        className={`w-9 text-left text-gray-300 ${score === 5 && "font-bold"}`}
                     >
                        {count}
                     </span>
                  </div>
               );
            })}
      </div>
   );
}
