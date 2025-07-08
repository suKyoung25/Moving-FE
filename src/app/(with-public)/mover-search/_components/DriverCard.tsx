import MoverProfile from '@/components/common/profile/MoverProfile';
import MoveChip from '@/components/common/chips/MoveChip';

export default function DriverCard() {
  return (
    <div className="flex items-center justify-center w-full h-[188px] lg:h-[230px] bg-white rounded-xl border border-gray-50 shadow-sm">
      <div className='flex flex-col'>
      {/* 서비스 태그 */}
      <div className="flex items-center mb-2 gap-2">
        <MoveChip type="SMALL" mini={false} />
        <MoveChip type="DESIGNATED" mini={false} />
      </div>


      {/* 소개 문구 */}
      <p className="text-14-semibold md:text-14-semibold lg:text-24-semibold text-gray-700 mb-3">
        고객님의 물품을 안전하게 운송해 드립니다.
      </p>

      {/* MoverProfile 삽입 */}
      <div className="w-[300px] h-[78px] md:w-[572px] lg:w-[907px] lg:h-[92px] box-border">
        <MoverProfile
          big={false}
          isLiked={false}
          handleLikedClick={() => console.log('좋아요 클릭')}
          nickName="김코드"
          favoriteCount={136}
          averageReviewRating={5.0}
          reviewCount={178}
          career={7}
          estimateCount={334}
        />
      </div>
      </div>
    </div>
  );
}
