// src/components/domain/community/CommunityPostSkeleton.tsx
"use client";

import React from "react";

/** 게시글 카드 + 프로필 박스까지 한 번에 보여주는 스켈레톤 */
export default function CommunitySkeleton() {
   return (
      <div className="manimate-pulse cursor-pointer rounded-2xl bg-white px-3.5 py-4 shadow lg:px-6 lg:py-5">
         {/* 제목 */}
         <div className="mb-2">
            <div className="h-5 w-44 rounded bg-gray-200 md:h-6 lg:h-6" />
         </div>

         {/* 본문 2줄 */}
         <div className="space-y-2">
            <div className="h-4 w-[92%] rounded bg-gray-100" />
            <div className="h-4 w-[78%] rounded bg-gray-100" />
         </div>

         {/* ProfileBox 스켈레톤 */}
         <div className="border-line-100 mt-4 flex items-center gap-3 rounded-md border p-2.5 lg:gap-6">
            {/* 아바타 */}
            <div className="h-13 w-13 rounded-full bg-gray-200" />

            {/* 닉네임 / 우측 댓글+날짜 */}
            <div className="flex w-full items-center justify-between">
               {/* 닉네임 자리 */}
               <div className="h-4 w-28 rounded bg-gray-200 lg:h-5" />

               {/* 우측: 댓글 아이콘+숫자 / 날짜 */}
               <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5">
                     <div className="h-4 w-4 rounded-full bg-gray-200" />
                     <div className="h-3 w-4 rounded bg-gray-100" />
                  </div>
                  <div className="mt-1 h-3 w-40 rounded bg-gray-100 lg:h-3.5" />
               </div>
            </div>
         </div>
      </div>
   );
}
