"use client";

import React, { useState, useMemo } from "react";
import { Review, MoverReview } from "@/lib/types";
import { format } from "date-fns";
import ReviewStar from "./ReviewStar";
import LineDivider from "@/components/common/LineDivider";
import Pagination from "@/components/common/pagination";

interface ReviewListProps {
   reviews: Review[] | MoverReview[];
   isMoverView?: boolean;
}

// 개별 리뷰 아이템 컴포넌트 메모이제이션
const ReviewItem = React.memo(
   ({
      review,
      isMoverView,
   }: {
      review: Review | MoverReview;
      isMoverView: boolean;
   }) => (
      <li className="border-b-line-200 mx-4 space-y-4 border-b py-8 text-sm font-normal lg:space-y-6 lg:text-lg">
         <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
               <span>
                  {isMoverView
                     ? (review as MoverReview).clientName
                     : (review as Review).clientName}
               </span>
               <LineDivider className="mx-[9.5px] flex h-[14px] w-0.5 flex-col" />
               <span className="text-gray-300">
                  {format(new Date(review.createdAt), "yyyy-MM-dd")}
               </span>
            </div>
            <ReviewStar rating={review.rating} size="w-5 h-5" />
         </div>
         <div className="leading-normal">{review.content}</div>

         {isMoverView && (
            <div className="flex gap-2 text-xs text-gray-400">
               <span>{(review as MoverReview).moveType}</span>
               <LineDivider className="mx-1 flex h-3 w-0.5 flex-col" />
               <span>{(review as MoverReview).price.toLocaleString()}원</span>
               {(review as MoverReview).isDesignatedEstimate && (
                  <>
                     <LineDivider className="mx-1 flex h-3 w-0.5 flex-col" />
                     <span className="text-blue-500">지정 견적</span>
                  </>
               )}
            </div>
         )}
      </li>
   ),
);

ReviewItem.displayName = "ReviewItem";

export default function ReviewList({
   reviews,
   isMoverView = false,
}: ReviewListProps) {
   const [page, setPage] = useState<number>(1);
   const itemsPerPage = 6;

   // 페이지네이션 계산 메모이제이션
   const { paginatedReviews, totalPages } = useMemo(() => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginated = reviews.slice(startIndex, endIndex);
      const total = Math.max(1, Math.ceil(reviews.length / itemsPerPage));

      return {
         paginatedReviews: paginated,
         totalPages: total,
      };
   }, [reviews, page, itemsPerPage]);

   return (
      <div>
         <ul className="lg:mb-10">
            {paginatedReviews.map((review) => (
               <ReviewItem
                  key={review.id}
                  review={review}
                  isMoverView={isMoverView}
               />
            ))}
         </ul>
         <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
         />
      </div>
   );
}
