"use client";

import Image from "next/image";
import React from "react";
import heart from "@/assets/images/likeFilledIcon.svg";
import inActiveHeart from "@/assets/images/likeOutlineIcon.svg";
import profile from "@/assets/images/profileUploaderIcon.svg";
import star from "@/assets/images/starFilledIcon.svg";

type MoverProfileProps = {
  profileImage?: string;
  big?: boolean;
  isLiked?: boolean;
  handleLikedClick: () => void;
  nickName: string;
  favoriteCount: number;
  averageReviewRating: number;
  reviewCount: number;
  career: number;
  estimateCount: number;
};

export default function MoverProfile({
  profileImage, // 기사님 이미지
  big, // 찜한 기사님 페이지 사용
  isLiked, // 찜 여부확인용
  handleLikedClick, // 찜 하기, 취소하기
  nickName,
  favoriteCount,
  averageReviewRating,
  reviewCount,
  career,
  estimateCount, // 스키마 필드명 그대로 사용했습니다
}: MoverProfileProps) {
  return (
    <div
      className={
        `flex items-center bg-white rounded-md border border-line-100 px-2.5 py-4 lg:px-4.5 lg:py-4 w-full h-19.5 shadow-[4px_4px_16px_0px_rgba(233,233,233,0.10)] ` +
        (big ? "lg:h-28" : "lg:h-23")
      }
    >
      {/* 프로필 이미지 */}
      <div
        className={
          "relative rounded-full overflow-hidden mr-3 lg:mr-6 w-11.5 h-11.5 " +
          (big ? "lg:w-20 lg:h-20" : "lg:w-14 lg:h-14")
        }
      >
        <Image
          src={profileImage || profile}
          alt="프로필"
          fill
          className="object-cover"
        />
      </div>
      {/* 정보 영역 */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-14-semibold lg:text-18-semibold text-black-300">
            {nickName} 기사님
          </span>
          <div className="flex items-center">
            <button onClick={handleLikedClick}>
              <Image
                src={isLiked ? heart : inActiveHeart}
                width={24}
                height={24}
                alt="좋아요"
                className="mr-0.5 lg:mr-1"
              />
            </button>
            <span className="text-13-medium lg:text-18-medium text-black-300">
              {favoriteCount}
            </span>
          </div>
        </div>
        <div className="flex items-center mt-3 lg:mt-4 text-13-medium lg:text-16-medium text-gray-300">
          <span className="flex items-center gap-0.5 lg:gap-1">
            <Image src={star} width={16} height={16} alt="별점" />
            <span className=" text-black-300">{averageReviewRating}</span>
            <span>({reviewCount})</span>
          </span>
          <span className="h-3 w-px bg-line-200 mx-2.5 lg:mx-4"></span>
          <span className="flex items-center gap-0.5 lg:gap-1">
            <span>경력</span>
            <span className=" text-black-300 ">{career}년</span>
          </span>
          <span className="h-3 w-px bg-line-200 mx-2.5 lg:mx-4 "></span>
          <span className="flex items-center gap-0.5 lg:gap-1">
            <span className=" text-black-300">{estimateCount}건</span>
            <span>확정</span>
          </span>
        </div>
      </div>
    </div>
  );
}
