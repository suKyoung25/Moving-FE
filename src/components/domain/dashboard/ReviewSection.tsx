"use client";

import React, { useState, useEffect } from "react";
import { getMyReviews } from "@/lib/api/review/getMyReviews";
import { getMoverReviews } from "@/lib/api/review/getMoverReviews";
import { useAuth } from "@/context/AuthContext";
import ReviewBreakdown from "./ReviewBreakdown";
import ReviewStar from "./ReviewStar";
import ReviewList from "./ReviewList";
import { Review } from "@/lib/types";

interface DashboardReviewSectionProps {
  moverId?: string; // 상세페이지에서 기사 ID를 받을 수 있도록
}

export default function DashboardReviewSection({ moverId }: DashboardReviewSectionProps) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // 🔍 디버깅 로그 추가
  console.log('🔍 DashboardReviewSection props:', { moverId });
  console.log('🔍 Current user:', user);

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
        
        console.log('🔍 Fetching reviews with:', { userType: user?.userType, moverId });
        
        let response;
        
        // 🔥 수정된 로직: moverId가 있으면 user 없이도 실행
        if (moverId) {
          console.log('🔍 Case: moverId provided, fetching specific mover reviews (public access)');
          // 상세페이지에서 특정 기사의 리뷰 조회 (로그인 불필요)
          response = await getMoverReviews(1, 20, moverId);
        } else if (user?.userType === 'mover') {
          console.log('🔍 Case: mover user, fetching own reviews');
          // 기사님: 본인에게 달린 리뷰 조회
          response = await getMoverReviews(1, 20);
        } else if (user?.userType === 'client') {
          console.log('🔍 Case: client user without moverId, fetching own reviews');
          // 마이페이지에서 본인이 작성한 리뷰 조회
          response = await getMyReviews(1, 20);
        } else {
          console.log('🔍 Case: no user and no moverId, cannot fetch reviews');
          setLoading(false);
          return;
        }
        
        console.log('🔍 Raw API response:', response);
        
        // API 응답 구조에 따라 데이터 추출
        const reviewsData = response.data?.reviews || response.reviews || [];
        console.log('🔍 Extracted reviews data:', reviewsData);
        
        setReviews(reviewsData);
      } catch (err) {
        console.error('🔍 리뷰 조회 실패:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    // 🔥 조건 수정: moverId가 있거나 user가 있으면 실행
    if (moverId || user?.userType) {
      fetchReviews();
    } else {
      console.log('🔍 No moverId and no user, skipping fetch');
      setLoading(false);
    }
  }, [user?.userType, moverId]);

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
          리뷰를 불러오는데 실패했습니다: {error}
        </div>
      </section>
    );
  }

  // 🔥 제목 텍스트를 상황에 따라 변경
  const getSectionTitle = () => {
    if (moverId) {
      return `기사님 리뷰 (${reviewCount})`;
    } else if (user?.userType === 'mover') {
      return `받은 리뷰 (${reviewCount})`;
    } else {
      return `작성한 리뷰 (${reviewCount})`;
    }
  };

  console.log('🔍 Final render data:', { reviewCount, averageReviewRating, reviews });

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
          <ReviewList reviews={reviews} isMoverView={user?.userType === 'mover' || !!moverId} />
        </>
      ) : (
        <div className="mt-8 p-8 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">
            {moverId 
              ? '아직 작성된 리뷰가 없습니다.'
              : user?.userType === 'mover' 
                ? '아직 받은 리뷰가 없습니다.' 
                : '아직 작성한 리뷰가 없습니다.'
            }
          </p>
          {user?.userType === 'client' && !moverId && (
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