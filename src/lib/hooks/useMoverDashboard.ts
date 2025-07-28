// hooks/useMoverDashboard.ts
"use client";

import { useState, useEffect } from 'react';
import { getMyReviews } from '@/lib/api/review/getMyReviews';
import { getWritableReviews } from '@/lib/api/review/getWritableReviews';

// 기사님 대시보드용 훅
export const useMoverDashboardData = () => {
  const [myReviews, setMyReviews] = useState(null);
  const [writableReviews, setWritableReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 병렬로 데이터 fetching
        const [myReviewsResponse, writableReviewsResponse] = await Promise.all([
          getMyReviews(1, 6),
          getWritableReviews(1, 6)
        ]);

        setMyReviews(myReviewsResponse);
        setWritableReviews(writableReviewsResponse);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refreshData = async () => {
    try {
      const [myReviewsResponse, writableReviewsResponse] = await Promise.all([
        getMyReviews(1, 6),
        getWritableReviews(1, 6)
      ]);

      setMyReviews(myReviewsResponse);
      setWritableReviews(writableReviewsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  return {
    myReviews,
    writableReviews,
    loading,
    error,
    refreshData
  };
};
