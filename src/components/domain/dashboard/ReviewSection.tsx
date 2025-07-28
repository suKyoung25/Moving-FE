"use client";

import React, { useState, useEffect } from "react";
import { getMyReviews } from "@/lib/api/review/getMyReviews";
import { getMoverReviews } from "@/lib/api/review/getMoverReviews";
import { useAuth } from "@/context/AuthContext";
import ReviewBreakdown from "./ReviewBreakdown";
import ReviewStar from "./ReviewStar";
import ReviewList from "./ReviewList";
import { Review } from "@/lib/types";

export default function DashboardReviewSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // 리뷰 데이터에서 평균 평점과 총 개수 계산
  const reviewCount = reviews.length;
  const averageReviewRating = reviewCount > 0 
    ? reviews.reduce((sum, review: Review) => sum + review.rating, 0) / reviewCount 
    : 0;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        
        // 사용자 타입에 따라 다른 API 호출
        if (user?.userType === 'mover') {
          // 기사님: 본인에게 달린 리뷰 조회
          response = await getMoverReviews(1, 20);
        } else {
          // 고객: 본인이 작성한 리뷰 조회
          response = await getMyReviews(1, 20);
        }
        
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

    if (user?.userType) {
      fetchReviews();
    }
  }, [user?.userType]);

  if (loading) {
    return (
      <section>
        <h1 className="font-bold lg:text-2xl">리뷰</h1>
        <div className="animate-pulse mt-8 h-64 bg-gray-200 rounded-lg"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h1 className="font-bold lg:text-2xl">리뷰</h1>
        <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg">
          리뷰를 불러오는데 실패했습니다.
        </div>
      </section>
    );
  }

  // 제목 텍스트를 사용자 타입에 따라 변경
  const sectionTitle = user?.userType === 'mover' 
    ? `받은 리뷰 (${reviewCount})` 
    : `작성한 리뷰 (${reviewCount})`;

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
          <ReviewList reviews={reviews} isMoverView={user?.userType === 'mover'} />
        </>
      ) : (
        <div className="mt-8 p-8 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">
            {user?.userType === 'mover' 
              ? '아직 받은 리뷰가 없습니다.' 
              : '아직 작성한 리뷰가 없습니다.'
            }
          </p>
          {user?.userType === 'client' && (
            <button 
              onClick={() => window.location.href = '/reviews/writable'}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              리뷰 작성하러 가기
            </button>
          )}
        </div>
      )}
    </section>
  );
}