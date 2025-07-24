export default async function QuoteCardSkeleton() {
   return (
      <div className="animate-pulse rounded-2xl bg-white px-3.5 py-4 lg:px-6 lg:py-5">
         {/* 상단 칩 영역 */}
         <div className="flex gap-1 md:gap-2 lg:gap-3">
            <div className="bg-primary-blue-100 h-6 w-14 rounded-sm" />
            <div className="bg-primary-blue-200 h-6 w-14 rounded-sm" />
            <div className="bg-primary-blue-300 h-6 w-20 rounded-sm" />
         </div>

         {/* 본문 내용 영역 */}
         <div className="mt-3.5 md:flex md:flex-col md:gap-2.5 lg:mt-4 lg:gap-6">
            <div className="h-5 w-32 rounded-md bg-gray-200 lg:h-6" />

            <div className="border-line-100 hidden w-full border-b md:block"></div>

            <div className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:gap-3.5">
               <div className="mt-3.5 flex flex-col gap-1 md:mt-0">
                  <div className="h-4 w-10 rounded bg-gray-200" />
                  <div className="h-5 w-32 rounded bg-gray-100 lg:h-6" />
               </div>
               <div className="border-line-100 w-full border-b md:!hidden"></div>

               <div className="flex gap-3.5">
                  <div className="flex flex-col gap-1">
                     <div className="h-4 w-10 rounded bg-gray-200" />
                     <div className="h-5 w-20 rounded bg-gray-100 lg:h-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                     <div className="h-4 w-10 rounded bg-gray-200" />
                     <div className="h-5 w-20 rounded bg-gray-100 lg:h-6" />
                  </div>
               </div>
            </div>

            {/* 조건부 금액 영역 */}
            <div className="mt-4 flex items-center justify-end gap-2 lg:mt-6 lg:gap-4">
               <div className="h-5 w-16 rounded bg-gray-200 lg:h-6" />
               <div className="h-6 w-24 rounded bg-gray-100 lg:h-7" />
            </div>
         </div>
      </div>
   );
}
