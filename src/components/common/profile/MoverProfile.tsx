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
   forceMobileStyle?: boolean;
   handleLikedClick: (e: React.MouseEvent) => void;
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
   forceMobileStyle = false, // lg일 때도 모바일 사이즈 강제 적용
   handleLikedClick, // 찜 하기, 취소하기
   nickName,
   favoriteCount,
   averageReviewRating,
   reviewCount,
   career,
   estimateCount, // 스키마 필드명 그대로 사용했습니다
}: MoverProfileProps) {
   const isBig = big && !forceMobileStyle;

   const containerClass = [
      "flex items-center bg-white rounded-md border border-line-100 w-full h-19.5 shadow-[4px_4px_16px_0px_rgba(233,233,233,0.10)]",
      forceMobileStyle
         ? "lg:h-19.5 px-2.5 py-4"
         : isBig
           ? "lg:h-28 px-4.5 py-4"
           : "lg:h-23 px-2.5 py-4",
   ].join(" ");

   const profileImageClass = [
      "relative rounded-full overflow-hidden mr-3 border-2 border-primary-blue-400",
      forceMobileStyle
         ? "w-11.5 h-11.5"
         : isBig
           ? "lg:w-20 lg:h-20 w-14 h-14 mr-6"
           : "lg:w-14 lg:h-14 w-11.5 h-11.5 mr-3",
   ].join(" ");

   return (
      <div className={containerClass}>
         {/* 프로필 이미지 */}
         <div className={profileImageClass}>
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
               <span
                  className={
                     forceMobileStyle
                        ? "text-14-semibold text-black-300"
                        : "text-14-semibold lg:text-18-semibold text-black-300"
                  }
               >
                  {nickName} 기사님
               </span>
               <div className="flex items-center">
                  <button onClick={handleLikedClick}>
                     <Image
                        src={isLiked ? heart : inActiveHeart}
                        width={24}
                        height={24}
                        alt="좋아요"
                        className={
                           forceMobileStyle ? "mr-0.5" : "mr-0.5 lg:mr-1"
                        }
                     />
                  </button>
                  <span
                     className={
                        forceMobileStyle
                           ? "text-13-medium text-black-300"
                           : "text-13-medium lg:text-18-medium text-black-300"
                     }
                  >
                     {favoriteCount}
                  </span>
               </div>
            </div>
            <div
               className={
                  forceMobileStyle
                     ? "text-13-medium mt-3 flex items-center text-gray-300"
                     : "text-13-medium lg:text-16-medium mt-3 flex items-center text-gray-300 lg:mt-4"
               }
            >
               <span className="flex items-center gap-0.5">
                  <Image src={star} width={16} height={16} alt="별점" />
                  <span className="text-black-300">{averageReviewRating}</span>
                  <span>({reviewCount})</span>
               </span>
               <span
                  className={
                     forceMobileStyle
                        ? "bg-line-200 mx-2.5 h-3 w-px"
                        : "bg-line-200 mx-2.5 h-3 w-px lg:mx-4"
                  }
               ></span>
               <span className="flex items-center gap-0.5">
                  <span>경력</span>
                  <span className="text-black-300">{career}년</span>
               </span>
               <span
                  className={
                     forceMobileStyle
                        ? "bg-line-200 mx-2.5 h-3 w-px"
                        : "bg-line-200 mx-2.5 h-3 w-px lg:mx-4"
                  }
               ></span>
               <span className="flex items-center gap-0.5">
                  <span className="text-black-300">{estimateCount}건</span>
                  <span>확정</span>
               </span>
            </div>
         </div>
      </div>
   );
}
