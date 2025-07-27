"use client";

import React, { useState, useEffect } from "react";
import { getMyReviews } from "@/lib/api/review/getMyReviews";
import ReviewBreakdown from "./ReviewBreakdown";
import ReviewStar from "./ReviewStar";
import ReviewList from "./ReviewList";

interface DashboardReviewSectionProps {
   averageReviewRating: number;
   reviewCount: number;
}

export default function DashboardReviewSection({
   averageReviewRating,
   reviewCount,
}: DashboardReviewSectionProps) {
   const [reviews, setReviews] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
     const fetchMyReviews = async () => {
       try {
         setLoading(true);
         const response = await getMyReviews(1, 20); // 충분한 양의 리뷰 가져오기
         
         // API 응답 구조에 따라 데이터 추출
         const reviewsData = response.data?.reviews || response.reviews || [];
         setReviews(reviewsData);
       } catch (err) {
         console.error('리뷰 조회 실패:', err);
         setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
       } finally {
         setLoading(false);
       }
     };

     fetchMyReviews();
   }, []);

   if (loading) {
     return (
       <section>
         <h1 className="font-bold lg:text-2xl">리뷰 ({reviewCount})</h1>
         <div className="animate-pulse mt-8 h-64 bg-gray-200 rounded-lg"></div>
       </section>
     );
   }

   if (error) {
     return (
       <section>
         <h1 className="font-bold lg:text-2xl">리뷰 ({reviewCount})</h1>
         <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg">
           리뷰를 불러오는데 실패했습니다.
         </div>
       </section>
     );
   }

   return (
      <section>
         <h1 className="font-bold lg:text-2xl">리뷰 ({reviewCount})</h1>
         <div className="lg:bg-bg-200 flex max-md:flex-col max-md:items-center md:mt-8 md:justify-center md:gap-14 lg:mb-10 lg:items-center lg:gap-[83px] lg:rounded-4xl lg:py-10">
            <div className="mt-8 mb-10 flex flex-col gap-[15px]">
               <div className="flex items-center justify-center gap-2 font-bold">
                  <div className="text-4xl lg:text-6xl">
                     {averageReviewRating.toFixed(1)}
                  </div>
                  <div className="justify-start text-2xl text-gray-100 lg:text-4xl">
                     / 5
                  </div>
               </div>
               <ReviewStar rating={averageReviewRating} />
            </div>
            <div className="bg-bg-200 flex w-80 justify-center rounded-3xl px-[18px] py-4 max-md:mb-[43px] lg:w-fit">
               <ReviewBreakdown reviews={reviews} />
            </div>
         </div>
         <ReviewList reviews={reviews} />
      </section>
   );
}