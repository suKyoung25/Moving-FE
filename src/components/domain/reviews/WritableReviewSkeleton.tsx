"use client";

import React from "react";

export default function WritableReviewSkeleton() {
   return (
      <div className="border-line-100 w-full animate-pulse rounded-2xl border bg-white px-3.5 pt-5 pb-3.5 shadow md:mb-2 md:px-4 lg:mb-6 lg:h-86.5 lg:px-6 lg:py-8">
         {/* 상단 칩 영역 */}
         <div className="mb-3.5 flex gap-2 lg:gap-3">
            <div className="bg-primary-blue-200 h-6 w-20 rounded-2xl" />
            <div className="bg-primary-blue-300 h-6 w-20 rounded-2xl" />
         </div>

         {/* 프로필 & 정보 카드 */}
         <div className="border-line-100 mb-3.5 flex w-full items-center rounded-md bg-white md:px-2 lg:mb-8 lg:border lg:px-4.5 lg:py-6">
            {/* 아바타 */}
            <div className="relative mr-3 h-11.5 w-11.5 overflow-hidden rounded-full bg-gray-200 lg:mr-6 lg:h-24 lg:w-24" />

            {/* 텍스트 영역 */}
            <div className="flex-1">
               {/* 기사님 이름 */}
               <div className="flex items-center justify-between">
                  <div className="h-4 w-36 rounded bg-gray-200 lg:h-5 lg:w-44" />
               </div>

               {/* 이사일 / 가격 */}
               <div className="text-13-medium lg:text-16-medium mt-3 flex flex-wrap items-center text-gray-300 lg:mt-4">
                  {/* 이사일 */}
                  <span className="flex items-center gap-1.5 lg:gap-3">
                     <div className="h-3 w-8 rounded bg-gray-100 lg:h-4" />
                     {/* 라벨 */}
                     <div className="h-3 w-28 rounded bg-gray-100 lg:h-4 lg:w-36" />
                     {/* 값 */}
                  </span>

                  {/* 구분선 */}
                  <span
                     className="bg-line-200 mx-2.5 h-3 w-px lg:mx-4"
                     aria-hidden="true"
                  />

                  {/* 가격 */}
                  <span className="flex items-center gap-1.5 lg:gap-3">
                     <div className="h-3 w-8 rounded bg-gray-100 lg:h-4" />
                     {/* 라벨 */}
                     <div className="h-3 w-24 rounded bg-gray-100 lg:h-4 lg:w-28" />
                     {/* 값 */}
                  </span>
               </div>
            </div>
         </div>

         {/* 리뷰 작성하기 버튼 자리 */}
         <div className="bg-primary-blue-300 h-12 w-full rounded-2xl lg:h-14" />
      </div>
   );
}
