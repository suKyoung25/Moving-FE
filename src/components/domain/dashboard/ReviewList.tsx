"use client";

import React, { useState } from "react";
import { Review, MoverReview } from "@/lib/types";
import { format } from "date-fns";
import ReviewStar from "./ReviewStar";
import LineDivider from "@/components/common/LineDivider";
import Pagination from "@/components/common/pagination";

interface ReviewListProps {
  reviews: Review[] | MoverReview[];
  isMoverView?: boolean; // 기사님 뷰인지 구분
}

export default function ReviewList({ reviews, isMoverView = false }: ReviewListProps) {
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
                <span>
                  {isMoverView 
                    ? (review as MoverReview).clientName 
                    : (review as Review).clientName
                  }
                </span>
                <LineDivider className="mx-[9.5px] flex h-[14px] w-0.5 flex-col" />
                <span className="text-gray-300">
                  {format(new Date(review.createdAt), "yyyy-MM-dd")}
                </span>
              </div>
              <ReviewStar rating={review.rating} size="w-5 h-5" />
            </div>
            <div className="leading-normal">{review.content}</div>
            
            {/* 기사님 뷰일 때 추가 정보 표시 */}
            {isMoverView && (
              <div className="text-xs text-gray-400 flex gap-2">
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
        ))}
      </ul>
      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(reviews.length / 6))}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}