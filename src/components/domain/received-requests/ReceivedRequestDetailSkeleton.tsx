export default function ReceivedRequestDetailSkeleton() {
   return (
      <div className="animate-pulse">
         {/* 카드 상단 */}
         <div className="border-line-100 rounded-2xl border bg-white px-4 py-5 lg:px-6 lg:py-6">
            <div className="flex flex-col gap-6">
               {/* 뱃지 영역 */}
               <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-primary-blue-200 h-6 w-16 rounded-sm" />
               </div>

               {/* 고객 이름 */}
               <div className="h-5 w-40 rounded bg-gray-200" />

               {/* 모바일 전용 이사일 */}
               <div className="flex items-center gap-3 md:hidden">
                  <div className="h-5 w-10 rounded bg-gray-100" />
                  <div className="h-5 w-36 rounded bg-gray-200" />
               </div>

               <div className="border-line-100 border" />

               {/* 주소 정보 */}
               <div className="flex gap-4 lg:gap-6 [&_div]:flex [&_div]:items-center [&_div]:gap-2">
                  <div className="!hidden md:!flex">
                     <div className="h-5 w-10 rounded bg-gray-100" />
                     <div className="h-5 w-36 rounded bg-gray-200" />
                  </div>
                  <div>
                     <div className="h-5 w-10 rounded bg-gray-100" />
                     <div className="h-5 w-20 rounded bg-gray-200" />
                  </div>
                  <div>
                     <div className="h-5 w-10 rounded bg-gray-100" />
                     <div className="h-5 w-20 rounded bg-gray-200" />
                  </div>
               </div>
            </div>
         </div>

         <div className="border-line-100 my-6 border lg:hidden" />

         {/* 모바일 공유 버튼 */}
         <div className="mb-6 lg:hidden">
            <div className="bg-primary-blue-100 h-10 w-40 rounded-xl" />
         </div>

         <div className="border-line-100 my-6 border" />

         {/* 견적 정보 */}
         <div>
            <div className="mb-5 h-6 w-32 rounded bg-gray-100" />
            <ul className="bg-bg-100 border-line-100 mt-5 flex flex-col gap-3 rounded-2xl border px-5 py-4 lg:gap-5 lg:px-6 lg:py-5">
               {Array.from({ length: 4 }).map((_, idx) => (
                  <li key={idx} className="flex items-center gap-10">
                     <div className="h-4 w-16 rounded bg-gray-100" />
                     <div className="h-4 w-40 rounded bg-gray-200" />
                  </li>
               ))}
            </ul>
         </div>
      </div>
   );
}
