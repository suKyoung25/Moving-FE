"use client";

import MoverProfile from "@/components/common/profile/MoverProfile";
import React, { useState } from "react";
import { moverMocks } from "./moverMock";
import MoveChip from "@/components/common/chips/MoveChip";
import { isChipType } from "@/types/chipType";

export default function FavoriteMover() {
  const movers = moverMocks;
  const [isLiked, setIsLiked] = useState(false);

  const handleLikedClick = () => {
    setIsLiked((prev) => !prev);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {movers.map((mover) => (
        <div
          key={mover.id}
          className="w-full h-37.5 lg:h-50.5 rounded-2xl bg-white border border-line-100 py-4 px-3.5 lg:py-5 lg:px-6 md:mb-2 lg:mb-6 shadow-[2px_2px_10px_0px_rgba(220,220,220,0.10),_-2px_-2px_10px_0px_rgba(220,220,220,0.10)]"
        >
          <div className="mb-3.5 flex gap-2">
            {mover.serviceType.map((type) =>
              isChipType(type) ? <MoveChip key={type} type={type} /> : null
            )}
          </div>
          <MoverProfile
            big={true}
            isLiked={isLiked}
            handleLikedClick={handleLikedClick}
            nickName={mover.nickName}
            favoriteCount={mover.favoriteCount}
            averageReviewRating={mover.averageReviewRating}
            reviewCount={mover.reviewCount}
            career={mover.career}
            estimateCount={mover.estimateCount}
          />
        </div>
      ))}
    </div>
  );
}
