"use client";

import { memo } from "react";

export default memo(function DriverCardSkeleton() {
   return (
      <div
         className="w-full overflow-hidden rounded-2xl"
         role="status"
         aria-live="polite"
      >
         <div className="border-line-100 w-full animate-pulse rounded-2xl border px-3.5 py-4 lg:px-6 lg:py-5">
            {/* 칩 + 채팅 버튼 라인 */}
            <div className="flex w-full items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="bg-primary-blue-300 h-7 w-16 rounded-full lg:h-8" />
                  <div className="bg-primary-blue-200 h-7 w-20 rounded-full lg:h-8" />
               </div>
            </div>

            {/* 소개 텍스트 */}
            <div className="mt-3 w-full space-y-2">
               <div className="h-4 w-full rounded bg-gray-200 lg:h-5" />
               <div className="h-4 w-8/12 rounded bg-gray-200 lg:h-5" />
            </div>

            {/* 프로필 영역 */}
            <div className="mt-4 flex w-full items-center justify-between">
               {/* 아바타 + 텍스트들 */}
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 lg:h-12 lg:w-12" />
                  <div className="flex flex-col gap-2">
                     <div className="h-4 w-32 rounded bg-gray-200 lg:w-40" />
                     <div className="flex items-center gap-3 [&_div]:rounded">
                        <div className="h-3 w-20 bg-gray-200" />
                        <div className="h-3 w-16 bg-gray-200" />
                        <div className="h-3 w-14 bg-gray-200" />
                        <div className="h-3 w-16 bg-gray-200" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <span className="sr-only">Loading driver card…</span>
      </div>
   );
});
