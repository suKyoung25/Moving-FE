"use client"; 

import { useState, useEffect, useCallback, useRef } from "react";
import DriverCard from "./DriverCard";
import { getMovers } from "@/lib/api/mover/getMover";
import { GetMoversParams } from "@/lib/types/mover.types";
import { areaMapping } from "@/constants/mover.constants";
import { tokenSettings } from "@/lib/utils/auth.util";
import type { Mover } from "@/lib/types";

interface DriverListProps {
  filters: {
    search: string;
    area: string;
    serviceType: string;
    sortBy: string;
  };
}

export default function DriverList({ filters }: DriverListProps) {
  const [movers, setMovers] = useState<Mover[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  // 무한스크롤을 위한 ref
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingElementRef = useRef<HTMLDivElement | null>(null);

  // loadMovers를 useCallback으로 메모이제이션하고 의존성 최적화
  const loadMovers = useCallback(async (reset = false, pageToLoad?: number) => {
    try {
      setLoading(true);
      setError(null);

      const targetPage = pageToLoad || (reset ? 1 : currentPage);

      if (reset) {
        setMovers([]);
        setCurrentPage(1);
      }

      let area = filters.area !== "all" ? filters.area : undefined;
      if (area && areaMapping[area]) {
        area = areaMapping[area][0];
      }

      const params: GetMoversParams = {
        page: targetPage,
        limit: 10,
        search: filters.search || undefined,
        area,
        serviceType: filters.serviceType !== "all" ? filters.serviceType : undefined,
        sortBy: filters.sortBy,
      };

      const hasToken = Boolean(tokenSettings.get());
      const response = await getMovers(params, hasToken);

      if (reset) {
        setMovers(response.movers);
        setCurrentPage(1);
      } else {
        setMovers(prev => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMovers = response.movers.filter((m) => !existingIds.has(m.id));
          return [...prev, ...newMovers];
        });
      }

      setHasMore(response.hasMore);
    } catch {
      setError("기사님 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [filters.area, filters.search, filters.serviceType, filters.sortBy, currentPage]);

  // loadMore를 별도로 분리하여 의존성 최적화
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    try {
      setLoading(true);

      let area = filters.area !== "all" ? filters.area : undefined;
      if (area && areaMapping[area]) {
        area = areaMapping[area][0];
      }

      const params: GetMoversParams = {
        page: nextPage,
        limit: 10,
        search: filters.search || undefined,
        area,
        serviceType: filters.serviceType !== "all" ? filters.serviceType : undefined,
        sortBy: filters.sortBy,
      };

      const hasToken = Boolean(tokenSettings.get());
      const response = await getMovers(params, hasToken);

      setMovers(prev => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newMovers = response.movers.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newMovers];
      });
      setHasMore(response.hasMore);
    } catch {
      setError("추가 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, hasMore, loading, filters.area, filters.search, filters.serviceType, filters.sortBy]);

  // 찜 상태 변경 핸들러
  const handleFavoriteChange = useCallback((moverId: string, isFavorite: boolean, favoriteCount: number) => {
    setMovers(prev => prev.map(mover => 
      mover.id === moverId 
        ? { ...mover, isFavorite, favoriteCount }
        : mover
    ));
  }, []);

  // 무한스크롤 IntersectionObserver 설정
  const setLoadingRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    loadingElementRef.current = node;

    if (node && hasMore && !loading) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const target = entries[0];
          if (target.isIntersecting) {
            loadMore();
          }
        },
        {
          root: null,
          rootMargin: '100px',
          threshold: 0.1
        }
      );
      observerRef.current.observe(node);
    }
  }, [hasMore, loading, loadMore]);

  // 필터 변경 시 데이터 다시 로드 - loadMovers를 의존성에 포함
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadMovers(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [loadMovers]); // loadMovers를 의존성에 포함

  // 컴포넌트 언마운트 시 observer 정리
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => loadMovers(true)}
            className="bg-primary-blue-300 hover:bg-primary-blue-400 rounded-lg px-4 py-2 text-white"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {movers.map((mover, index) => (
        <DriverCard 
          key={`${mover.id}-${index}`} 
          mover={mover} 
          onFavoriteChange={handleFavoriteChange}
        />
      ))}

      {/* 무한스크롤 트리거 */}
      {hasMore && (
        <div ref={setLoadingRef} className="flex justify-center p-4">
          {loading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-blue-300"></div>
              <span>로딩 중...</span>
            </div>
          )}
        </div>
      )}

      {/* 더 이상 데이터가 없을 때 */}
      {!hasMore && movers.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">모든 기사님을 확인했습니다.</p>
        </div>
      )}

      {/* 데이터가 없을 때 */}
      {!loading && movers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}