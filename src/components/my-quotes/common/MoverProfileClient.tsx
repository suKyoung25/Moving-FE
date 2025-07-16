"use client";

import MoveChip from "@/components/common/chips/MoveChip";
import MoverProfile from "@/components/common/profile/MoverProfile";
import profile from "@/assets/images/profileIcon.svg";

export default function MoverProfileclient() {
  return (
    <article className=" flex flex-col gap-3.5 ">
      <div className="flex items-center gap-2">
        <MoveChip type="PENDING" />
        <MoveChip type="SMALL" />
        <MoveChip type="DESIGNATED" />
      </div>
      <p className="text-14-semibold text-black-300 lg:text-20-semibold">
        고객님의 물품을 안전하게 운송해 드립니다.
      </p>
      <MoverProfile
        nickName="이삿짐킹"
        profileImage={profile}
        isLiked={false}
        handleLikedClick={() => console.log("찜 토글")}
        favoriteCount={24}
        averageReviewRating={4.8}
        reviewCount={37}
        career={7}
        estimateCount={120}
      />
    </article>
  );
}
