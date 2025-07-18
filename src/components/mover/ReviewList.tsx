"use client";

import React, { useState } from "react";
import LineDivider from "../detail/LineDivider";
import { Review } from "@/lib/types";
import { format } from "date-fns";
import ReviewStar from "./ReviewStar";
import Pagination from "../common/pagination";

export default function ReviewList({ reviews }: { reviews: Review[] }) {
   const [page, setPage] = useState<number>(1);

   return (
      <div>
         <ul className="lg:mb-10">
            {reviews.map((review) => (
               <li
                  key={review.id}
                  className="border-b-line-200 mx-4 space-y-4 border-b py-8 text-sm font-normal lg:space-y-6 lg:text-lg"
               >
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-3">
                        <span>{review.clientName}</span>
                        <LineDivider className="mx-[9.5px] flex h-[14px] w-0.5 flex-col" />
                        <span className="text-gray-300">
                           {format(review.createdAt, "yyyy-MM-dd")}
                        </span>
                     </div>
                     <ReviewStar rating={review.rating} size="w-5 h-5" />
                  </div>
                  <div className="leading-normal">{review.content}</div>
               </li>
            ))}
         </ul>
         <Pagination
            page={page}
            totalPages={reviews.length}
            onPageChange={(page) => setPage(page + 1)}
         />
      </div>
   );
}
