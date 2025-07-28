'use client';

import { useState, useEffect } from 'react';
import MoverProfile from '@/components/common/MoverProfile';
import MoveChip, { ChipType } from '@/components/common/MoveChip';
import { getFavoriteMovers } from '@/lib/api/favorite/getFavoriteMovers';
import { Mover } from '@/lib/types/auth.types';
import { useMover } from './MoverStateControll';
import { tokenSettings } from '@/lib/utils/auth.util';

export default function FavoriteDriverList() {
  const [favoriteMovers, setFavoriteMovers] = useState<Mover[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toggleFavorite } = useMover();

  // 인증 상태 확인 함수 - 기존 tokenSettings 사용
  const checkAuthStatus = () => {
    return Boolean(tokenSettings.get());
  };

  // 찜한 기사님 목록 로드
  const loadFavoriteMovers = async () => {
    // 인증되지 않은 경우 API 호출하지 않음
    if (!isAuthenticated) {
      setFavoriteMovers([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 최대 3개까지만 가져오기
      const response = await getFavoriteMovers(1, 3);
      
      if (response?.data?.movers) {
        setFavoriteMovers(response.data.movers);
      }
    } catch (err) {
      console.error('찜한 기사님 목록 로드 실패:', err);
      
      // 인증 에러인 경우 다른 에러 메시지 표시
      if (err instanceof Error && err.message.includes('로그인')) {
        setError('로그인이 필요한 서비스입니다.');
        setIsAuthenticated(false);
      } else {
        setError('찜한 기사님 목록을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 인증 상태 확인 후 데이터 로드
  useEffect(() => {
    const authStatus = checkAuthStatus();
    setIsAuthenticated(authStatus);
    
    if (authStatus) {
      loadFavoriteMovers();
    }
  }, []);

  // 찜 토글 핸들러
  const handleFavoriteToggle = async (moverId: string) => {
    try {
      await toggleFavorite(moverId);
      // 찜 해제 후 목록에서 제거
      setFavoriteMovers(prev => prev.filter(mover => mover.id !== moverId));
    } catch (err) {
      console.error('찜 토글 실패:', err);
    }
  };

  // 로그인되지 않은 경우 컴포넌트를 렌더링하지 않음
  if (!isAuthenticated) {
    return null;
  }

  // 로딩 상태
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

  // 에러 상태
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

  // 찜한 기사님이 없는 경우
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
          {/* 칩 섹션 */}
          <div className="flex gap-1">
            {mover.serviceType?.map((type: string, index: number) => {
              // 서비스 타입을 ChipType으로 변환
              const chipType = type.toUpperCase() as ChipType;
              // 유효한 ChipType인지 확인
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

          {/* 소개글 */}
          {mover.description && (
            <p className="text-14-medium text-gray-700 line-clamp-2">
              {mover.description}
            </p>
          )}

          {/* 프로필 */}
          <MoverProfile
            profileImage={mover.profileImage}
            forceMobileStyle={true}
            big={false}
            isLiked={mover.isFavorite}
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
      
      {/* 더보기 링크 (3개 이상일 때만 표시) */}
      {favoriteMovers.length === 3 && (
        <div className="text-center pt-2">
          <button className="text-14-medium text-primary-blue-400 hover:text-primary-blue-500">
            더 많은 찜한 기사님 보기
          </button>
        </div>
      )}
    </div>
  );
}