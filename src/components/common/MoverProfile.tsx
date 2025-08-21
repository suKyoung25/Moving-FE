"use client";

import Image from "next/image";
import React from "react";
import heart from "@/assets/images/likeFilledIcon.svg";
import inActiveHeart from "@/assets/images/likeOutlineIcon.svg";
import profileIcon from "@/assets/images/profileIcon.svg";
import star from "@/assets/images/starFilledIcon.svg";
import { useTranslations } from "next-intl";

interface MoverProfileProps {
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
   showHeart?: boolean; //  하트 표시 여부 제어
}

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
   showHeart = true, //  기본값은 true (하트 표시)
}: MoverProfileProps) {
   const t = useTranslations("Reviews");

   console.log(nickName);

   const isBig = big && !forceMobileStyle;

   const containerClass = [
      "flex items-center bg-white rounded-md border border-line-100 w-full h-19.5 ",
      forceMobileStyle
         ? "lg:h-19.5 px-2.5 py-4"
         : isBig
           ? "lg:h-28 px-4.5 py-4"
           : "lg:h-23 px-2.5 py-4",
   ].join(" ");

   const profileImageClass = [
      "relative rounded-full overflow-hidden mr-3 border-primary-blue-400",
      forceMobileStyle
         ? "w-11.5 h-11.5"
         : isBig
           ? "lg:w-20 lg:h-20 w-14 h-14 mr-6"
           : "lg:w-14 lg:h-14 w-11.5 h-11.5 mr-3",
   ].join(" ");

   const likeButtonLabel = isLiked
      ? t("unlikeMover", { name: nickName })
      : t("likeMover", { name: nickName });

   return (
      <div className={containerClass}>
         {/* 프로필 이미지 */}
         <div className={profileImageClass}>
            <Image
               src={profileImage || profileIcon}
               alt={
                  profileImage
                     ? t("profileAlt", { name: nickName })
                     : t("defaultProfileAlt")
               }
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
                        ? "text-16-semibold"
                        : "text-16-semibold lg:text-18-semibold"
                  }
               >
                  {nickName} {t("mover")}
               </span>

               {/*  showHeart가 true일 때만 하트와 찜 개수 표시 */}
               {showHeart && (
                  <div className="flex items-center">
                     <button
                        onClick={handleLikedClick}
                        aria-pressed={isLiked}
                        aria-label={
                           likeButtonLabel ??
                           t(isLiked ? "unlikeMover" : "likeMover", {
                              name: nickName,
                           })
                        }
                     >
                        <Image
                           src={isLiked ? heart : inActiveHeart}
                           width={24}
                           height={24}
                           alt=""
                           aria-hidden="true"
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
               )}
            </div>
            <div
               className={
                  forceMobileStyle
                     ? "text-13-medium mt-3 flex items-center text-gray-300"
                     : "text-13-medium lg:text-16-medium flex items-center text-gray-300"
               }
            >
               <span
                  className="flex items-center gap-0.5"
                  role="img"
                  aria-label={t("ratingAria", {
                     rating: averageReviewRating.toFixed(1),
                  })}
               >
                  <Image
                     src={star}
                     width={16}
                     height={16}
                     alt=""
                     aria-hidden="true"
                  />
                  <span className="text-black-300">
                     {averageReviewRating.toFixed(1)}
                  </span>
                  <span>({reviewCount})</span>
               </span>
               <span
                  className={
                     forceMobileStyle
                        ? "bg-line-200 mx-2.5 h-3 w-px"
                        : "bg-line-200 mx-2.5 h-3 w-px lg:mx-4"
                  }
                  aria-hidden="true"
               ></span>
               <span className="flex items-center gap-0.5">
                  <span>{t("career")}</span>
                  <span className="text-black-300">
                     {career}
                     {t("year")}
                  </span>
               </span>
               <span
                  className={
                     forceMobileStyle
                        ? "bg-line-200 mx-2.5 h-3 w-px"
                        : "bg-line-200 mx-2.5 h-3 w-px lg:mx-4"
                  }
               ></span>
               <span className="flex items-center gap-0.5">
                  <span className="text-black-300">
                     {estimateCount}
                     {t("cases")}
                  </span>
                  <span>{t("confirmed")}</span>
               </span>
            </div>
         </div>
      </div>
   );
}
