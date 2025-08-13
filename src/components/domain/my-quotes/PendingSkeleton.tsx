"use client";

import React from "react";

export default function PendingSkeleton() {
   return (
      <section className="mx-auto flex w-full animate-pulse flex-col gap-2 rounded-2xl bg-white px-3 pt-5 pb-3.5 shadow lg:mx-0 lg:w-172 lg:px-6 lg:pt-7 lg:pb-5.5">
         <div className="mb-3 flex gap-2">
            <div className="h-6 w-16 rounded-full bg-gray-200" />
            <div className="bg-primary-blue-300 h-6 w-16 rounded-full" />
         </div>
         {/* 프로필 + 정보 */}
         <div className="flex flex-col gap-3.5">
            {/* 프로필 */}
            <div className="flex items-center gap-3.5">
               <div className="h-12 w-12 rounded-full bg-gray-200" />
               <div className="flex flex-col gap-2">
                  <div className="h-4 w-28 rounded bg-gray-100" />
                  <div className="h-3 w-20 rounded bg-gray-100" />
               </div>
            </div>

            {/* 이사 날짜 */}
            <div className="h-4 w-32 rounded bg-gray-100" />

            {/* 출발 / 도착 */}
            <div className="flex items-center gap-3.5">
               <div className="h-4 flex-1 rounded bg-gray-100" />
               <div className="h-3.5 w-px bg-gray-200" />
               <div className="h-4 flex-1 rounded bg-gray-100" />
            </div>
         </div>

         {/* 가격 */}
         <div className="mt-1 text-right">
            <div className="ml-auto h-5 w-24 rounded bg-gray-100" />
         </div>

         {/* 버튼 영역 */}
         <div className="flex flex-col gap-2 md:flex-row">
            <div className="bg-primary-blue-300 h-10 flex-1 rounded-lg" />
            <div className="border-primary-blue-300 h-10 flex-1 rounded-lg border" />
         </div>
      </section>
   );
}
