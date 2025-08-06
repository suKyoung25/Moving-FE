"use client";

import React, { useState, useEffect } from "react";
import { getMyReviews } from "@/lib/api/review/reviews/getMyReviews";
import { getMoverReviews } from "@/lib/api/review/reviews/getMoverReviews";
import { useAuth } from "@/context/AuthContext";
import ReviewBreakdown from "./ReviewBreakdown";
import ReviewStar from "./ReviewStar";
import ReviewList from "./ReviewList";
import { Review } from "@/lib/types";
import { useTranslations } from "next-intl";

interface DashboardReviewSectionProps {
   moverId?: string; // 상세페이지에서 기사 ID를 받을 수 있도록
}

export default function DashboardReviewSection({
   moverId,
}: DashboardReviewSectionProps) {
   const t = useTranslations("Dashboard");

   const [reviews, setReviews] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const { user } = useAuth();

   // 리뷰 데이터에서 평균 평점과 총 개수 계산
   const reviewCount = reviews.length;
   const averageReviewRating =
      reviewCount > 0
         ? reviews.reduce((sum, review: Review) => sum + review.rating, 0) /
           reviewCount
         : 0;

   useEffect(() => {
      const fetchReviews = async () => {
         try {
            setLoading(true);
            setError(null);

            let response;

            //  수정된 로직: moverId가 있으면 user 없이도 실행
            if (moverId) {
               // 상세페이지에서 특정 기사의 리뷰 조회 (로그인 불필요)
               response = await getMoverReviews(1, 20, moverId);
            } else if (user?.userType === "mover") {
               // 기사님: 본인에게 달린 리뷰 조회
               response = await getMoverReviews(1, 20);
            } else if (user?.userType === "client") {
               // 마이페이지에서 본인이 작성한 리뷰 조회
               response = await getMyReviews(1, 20);
            } else {
               setLoading(false);
               return;
            }

            // API 응답 구조에 따라 데이터 추출
            const reviewsData =
               response.data?.reviews || response.reviews || [];
            setReviews(reviewsData);
         } catch (err) {
            setError(err instanceof Error ? err.message : t("unknownError"));
         } finally {
            setLoading(false);
         }
      };

      //  조건 수정: moverId가 있거나 user가 있으면 실행
      if (moverId || user?.userType) {
         fetchReviews();
      } else {
         setLoading(false);
      }
   }, [user?.userType, moverId]);

   if (loading) {
      return (
         <section>
            <h1 className="font-bold lg:text-2xl">{t("reviewTitle")}</h1>
            <div className="mt-8 h-64 animate-pulse rounded-lg bg-gray-200"></div>
         </section>
      );
   }

   if (error) {
      return (
         <section>
            <h1 className="font-bold lg:text-2xl">{t("reviewTitle")}</h1>
            <div className="mt-8 rounded-lg bg-red-100 p-4 text-red-700">
               {t("reviewLoadFail")}: {error}
            </div>
         </section>
      );
   }

   //  제목 텍스트를 상황에 따라 변경
   const getSectionTitle = () => {
      if (moverId) {
         return t("moverReviewsTitle", { count: reviewCount });
      } else if (user?.userType === "mover") {
         return t("receivedReviewsTitle", { count: reviewCount });
      } else {
         return t("writtenReviewsTitle", { count: reviewCount });
      }
   };

   return (
      <section>
         <h1 className="font-bold lg:text-2xl">{getSectionTitle()}</h1>

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
                     ? t("noReviewsYet")
                     : user?.userType === "mover"
                       ? t("noReceivedReviewsYet")
                       : t("noWrittenReviewsYet")}
               </p>
               {user?.userType === "client" && !moverId && (
                  <button
                     onClick={() =>
                        (window.location.href = "/reviews/writable")
                     }
                     className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                  >
                     {t("writeReviewButton")}
                  </button>
               )}
            </div>
         )}
      </section>
   );
}
