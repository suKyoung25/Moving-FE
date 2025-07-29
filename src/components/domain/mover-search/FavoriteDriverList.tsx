'use client';

import { useState, useEffect, useCallback } from 'react';
import MoverProfile from '@/components/common/MoverProfile';
import MoveChip, { ChipType } from '@/components/common/MoveChip';
import { getFavoriteMovers } from '@/lib/api/favorite/getFavoriteMovers';
import { Mover } from '@/lib/types/auth.types';
import { tokenSettings } from '@/lib/utils/auth.util';
import { toggleFavoriteMover } from '@/lib/api/estimate/requests/favoriteMover';

export default function FavoriteDriverList() {
  const [favoriteMovers, setFavoriteMovers] = useState<Mover[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 인증 상태 확인 함수
  const checkAuthStatus = useCallback(() => {
    return Boolean(tokenSettings.get());
  }, []);

  // 찜한 기사님 목록 로드 - useCallback으로 메모이제이션
  const loadFavoriteMovers = useCallback(async () => {
    const authStatus = checkAuthStatus();
    setIsAuthenticated(authStatus);
    
    if (!authStatus) {
      setFavoriteMovers([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getFavoriteMovers(1, 3);
      
      if (response?.data?.movers) {
        // 🔥 찜한 목록이므로 모든 기사님의 isFavorite를 true로 강제 설정
        const moversWithFavoriteTrue = response.data.movers.map((mover: Mover) => ({
          ...mover,
          isFavorite: true
        }));
        setFavoriteMovers(moversWithFavoriteTrue);
      }
    } catch (err) {
      console.error('찜한 기사님 목록 로드 실패:', err);
      
      if (err instanceof Error && err.message.includes('로그인')) {
        setError('로그인이 필요한 서비스입니다.');
        setIsAuthenticated(false);
      } else {
        setError('찜한 기사님 목록을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, [checkAuthStatus]);

  // 찜 토글 핸들러 - 독립적으로 처리
  const handleFavoriteToggle = useCallback(async (moverId: string) => {
    try {
      await toggleFavoriteMover(moverId);
      // 찜 해제 후 목록에서 제거
      setFavoriteMovers(prev => prev.filter(mover => mover.id !== moverId));
    } catch (err) {
      console.error('찜 토글 실패:', err);
      alert('찜 처리 중 오류가 발생했습니다.');
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadFavoriteMovers();
  }, [loadFavoriteMovers]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="mt-8 flex flex-col gap-4 rounded-lg">
        <h2 className="text-18-semibold border-b pb-5 border-b-gray-100">찜한 기사님</h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-14-medium text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 flex flex-col gap-4 rounded-lg">
        <h2 className="text-18-semibold border-b pb-5 border-b-gray-100">찜한 기사님</h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-14-medium text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (favoriteMovers.length === 0) {
    return (
      <div className="mt-8 flex flex-col gap-4 rounded-lg">
        <h2 className="text-18-semibold border-b pb-5 border-b-gray-100">찜한 기사님</h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-14-medium text-gray-500">찜한 기사님이 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-4 rounded-lg">
      <h2 className="text-18-semibold border-b pb-5 border-b-gray-100">찜한 기사님</h2>
      
      {favoriteMovers.map((mover) => (
        <div
          key={mover.id}
          className="bg-white rounded-lg border border-gray-50 p-3 flex flex-col gap-2 shadow-sm"
        >
          <div className="flex gap-1">
            {mover.serviceType?.map((type: string, index: number) => {
              const chipType = type.toUpperCase() as ChipType;
              const validChipTypes: ChipType[] = ['SMALL', 'HOME', 'OFFICE', 'DESIGNATED', 'PENDING', 'DONE'];
              
              if (validChipTypes.includes(chipType)) {
                return (
                  <MoveChip 
                    key={index}
                    type={chipType} 
                    mini={false} 
                  />
                );
              }
              return null;
            })}
          </div>

          {mover.description && (
            <p className="text-14-medium text-gray-700 line-clamp-2">
              {mover.description}
            </p>
          )}

          <MoverProfile
            profileImage={mover.profileImage}
            forceMobileStyle={true}
            big={false}
            isLiked={true}
            handleLikedClick={() => handleFavoriteToggle(mover.id)}
            nickName={mover.nickName || " "}
            favoriteCount={mover.favoriteCount || 0}
            averageReviewRating={mover.averageReviewRating || 0}
            reviewCount={mover.reviewCount || 0}
            career={Number(mover.career) || 0}
            estimateCount={mover.estimateCount || 0}
          />
        </div>
      ))}
    </div>
  );
}