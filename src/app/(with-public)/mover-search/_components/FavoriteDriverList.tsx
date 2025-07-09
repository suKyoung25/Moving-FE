'use client';

import MoverProfile from '@/components/common/profile/MoverProfile';
import MoveChip from '@/components/common/chips/MoveChip';

export default function FavoriteDriverList() {
  return (
    <div className="mt-8 flex flex-col gap-4 rounded-lg">
      <h2 className="text-18-semibold border-b pb-5 border-b-gray-100 ">찜한 기사님</h2>
      {/* 반복 렌더링할 때 map 사용 예정 */}
      {[1, 2].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-gray-50 p-3 flex flex-col gap-2 shadow-sm"
        >
          {/* 칩 섹션 */}
          <div className="flex gap-1">
            <MoveChip type="SMALL" mini={false} />
            <MoveChip type="DESIGNATED" mini={false} />
          </div>

          {/* 소개글 */}
          <p className="text-14-medium text-gray-700">
            고객님의 물품을 안전하게 운송해 드립니다.
          </p>

          {/* 프로필 */}
          <MoverProfile
            forceMobileStyle={true}
            big={false}
            isLiked={true}
            handleLikedClick={() => console.log('좋아요 클릭')}
            nickName="김코드"
            favoriteCount={136}
            averageReviewRating={5.0}
            reviewCount={178}
            career={7}
            estimateCount={334}
          />
        </div>
      ))}
    </div>
  );
}
