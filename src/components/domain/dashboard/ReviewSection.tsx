"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getMyReviews } from "@/lib/api/review/reviews/getMyReviews";
import { getMoverReviews } from "@/lib/api/review/reviews/getMoverReviews";
import { useAuth } from "@/context/AuthContext";
import ReviewBreakdown from "./ReviewBreakdown";
import ReviewStar from "./ReviewStar";
import ReviewList from "./ReviewList";
import { Review } from "@/lib/types";

interface DashboardReviewSectionProps {
   moverId?: string;
}

export default function DashboardReviewSection({
   moverId,
}: DashboardReviewSectionProps) {
   const [reviews, setReviews] = useState<Review[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const { user } = useAuth();

   // 계산된 값들 메모이제이션
   const { reviewCount, averageReviewRating, sectionTitle } = useMemo(() => {
      const count = reviews.length;
      const average =
         count > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / count
            : 0;

      let title = "리뷰";
      if (moverId) {
         title = `기사님 리뷰 (${count})`;
      } else if (user?.userType === "mover") {
         title = `받은 리뷰 (${count})`;
      } else {
         title = `작성한 리뷰 (${count})`;
      }

      return {
         reviewCount: count,
         averageReviewRating: average,
         sectionTitle: title,
      };
   }, [reviews, moverId, user?.userType]);

   useEffect(() => {
      const fetchReviews = async () => {
         if (!moverId && !user?.userType) {
            setLoading(false);
            return;
         }

         try {
            setLoading(true);
            setError(null);

            let response;
            if (moverId) {
               response = await getMoverReviews(1, 20, moverId);
            } else if (user?.userType === "mover") {
               response = await getMoverReviews(1, 20);
            } else if (user?.userType === "client") {
               response = await getMyReviews(1, 20);
            }

            const reviewsData =
               response?.data?.reviews || response?.reviews || [];
            setReviews(reviewsData);
         } catch (err) {
            setError(
               err instanceof Error
                  ? err.message
                  : "알 수 없는 오류가 발생했습니다.",
            );
         } finally {
            setLoading(false);
         }
      };

      fetchReviews();
   }, [user?.userType, moverId]);

   if (loading) {
      return (
         <section>
            <h1 className="font-bold lg:text-2xl">리뷰</h1>
            <div className="mt-8 h-64 animate-pulse rounded-lg bg-gray-200"></div>
         </section>
      );
   }

   if (error) {
      return (
         <section>
            <h1 className="font-bold lg:text-2xl">리뷰</h1>
            <div className="mt-8 rounded-lg bg-red-100 p-4 text-red-700">
               리뷰를 불러오는데 실패했습니다: {error}
            </div>
         </section>
      );
   }

   return (
      <section>
         <h1 className="font-bold lg:text-2xl">{sectionTitle}</h1>

         {reviewCount > 0 ? (
            <>
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
               <ReviewList
                  reviews={reviews}
                  isMoverView={user?.userType === "mover" || !!moverId}
               />
            </>
         ) : (
            <div className="mt-8 rounded-lg bg-gray-50 p-8 text-center">
               <p className="mb-4 text-gray-500">
                  {moverId
                     ? "아직 작성된 리뷰가 없습니다."
                     : user?.userType === "mover"
                       ? "아직 받은 리뷰가 없습니다."
                       : "아직 작성한 리뷰가 없습니다."}
               </p>
               {user?.userType === "client" && !moverId && (
                  <button
                     onClick={() =>
                        (window.location.href = "/reviews/writable")
                     }
                     className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                  >
                     리뷰 작성하러 가기
                  </button>
               )}
            </div>
         )}
      </section>
   );
}
