"use client";
// ReviewCardSkeleton.tsx
export default function MyReviewsSkeleton() {
   return (
      <div className="border-line-100 animate-pulse rounded-2xl border bg-white p-4 shadow lg:p-6">
         {/* 칩 영역 */}
         <div className="mb-3.5 flex gap-2 lg:gap-3">
            <div className="bg-primary-blue-200 h-6 w-16 rounded-2xl" />
            <div className="bg-primary-blue-300 h-6 w-20 rounded-2xl" />
         </div>

         {/* 작성일 */}
         <div className="absolute right-3.5 bottom-2.5 lg:top-9 lg:right-9">
            <div className="h-3 w-24 rounded bg-gray-100" />
         </div>

         {/* 프로필 & 정보 */}
         <div className="border-line-100 mb-3.5 flex w-full items-center rounded-md border-b-1 bg-white pb-2.5 md:px-2 lg:mb-8 lg:border lg:px-4.5 lg:py-6">
            {/* 프로필 이미지 */}
            <div className="mr-3 h-11.5 w-11.5 rounded-full bg-gray-200 lg:mr-6 lg:h-24 lg:w-24" />

            {/* 텍스트 정보 */}
            <div className="flex-1">
               {/* 닉네임 & 버튼 */}
               <div className="flex items-center justify-between">
                  <div className="h-4 w-28 rounded bg-gray-200" />
                  <div className="h-6 w-6 rounded-full bg-gray-100" />
               </div>

               {/* 날짜 & 가격 */}
               <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 lg:mt-2">
                  <div className="h-3 w-20 rounded bg-gray-100" />
                  <div className="h-3 w-16 rounded bg-gray-100" />
               </div>

               {/* 별점 */}
               <div className="hidden gap-1 lg:mt-4 lg:flex">
                  {Array(5)
                     .fill(0)
                     .map((_, i) => (
                        <div
                           key={i}
                           className="h-6 w-6 rounded-full bg-gray-100"
                        />
                     ))}
               </div>
            </div>
         </div>

         {/* 리뷰 내용 */}
         <div className="h-12 rounded bg-gray-100 lg:h-16" />
      </div>
   );
}
