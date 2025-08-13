// FavoriteMoverSkeleton.tsx
"use client";

export default function FavoriteMoverSkeleton() {
   return (
      <div
         className="border-line-100 w-full animate-pulse rounded-2xl border bg-white px-3.5 py-4 shadow lg:h-50.5 lg:px-6 lg:py-5"
         role="listitem"
      >
         {/* 서비스 타입 칩 영역 */}
         <div className="mb-3.5 flex gap-2 lg:gap-3">
            <div className="bg-primary-blue-200 h-6 w-14 rounded-2xl" />
            <div className="bg-primary-blue-300 h-6 w-16 rounded-2xl" />
         </div>

         {/* 내부 프로필 카드 */}
         <div className="border-line-100 flex items-center justify-between rounded-xl border bg-white p-3 shadow-sm lg:p-5">
            {/* 왼쪽: 프로필 이미지 + 텍스트 */}
            <div className="flex items-center gap-3">
               {/* 프로필 이미지 */}
               <div className="h-12 w-12 rounded-full bg-gray-200 lg:h-14 lg:w-14" />
               {/* 텍스트 정보 */}
               <div className="flex flex-col gap-2">
                  <div className="h-4 w-24 rounded bg-gray-200" />{" "}
                  {/* 닉네임 */}
                  <div className="flex items-center gap-2">
                     <div className="h-3 w-8 rounded bg-gray-100" />{" "}
                     {/* 리뷰 */}
                     <div className="h-3 w-10 rounded bg-gray-100" />{" "}
                     {/* 경력 */}
                     <div className="h-3 w-10 rounded bg-gray-100" />{" "}
                     {/* 확정 건수 */}
                  </div>
               </div>
            </div>

            {/* 오른쪽: 좋아요 버튼 자리 */}
            <div className="h-6 w-6 rounded-full bg-gray-200" />
         </div>
      </div>
   );
}
