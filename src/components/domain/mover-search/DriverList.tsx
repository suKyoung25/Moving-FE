"use client";

import DriverCard from "./DriverCard";
import { useMover } from "@/context/mover";
import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll";

// ✅ sortBy prop 제거 - Context에서 직접 상태 관리
export default function DriverList() {
   // ✅ Context에서 모든 상태와 함수들 가져오기
   const { state, loadMore } = useMover();
   const { movers, loading, error, hasMore } = state;

   // ✅ useEffect 제거 - Context에서 자동으로 필터 변경 감지하여 데이터 로드

   const { setLoadingRef } = useInfiniteScroll({
      hasMore,
      isLoading: loading,
      onLoadMore: loadMore,
   });

   if (error) {
      return (
         <div className="flex flex-col items-center justify-center p-8">
            <div className="text-center">
               <p className="text-gray-500 mb-4">{error}</p>
               <button
                  onClick={() => window.location.reload()}
                  className="bg-primary-blue-300 hover:bg-primary-blue-400 rounded-lg px-4 py-2 text-white"
               >
                  다시 시도
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-4">
         {movers.map((mover, index) => (
            <DriverCard key={`${mover.id}-${index}`} mover={mover} />
         ))}

         {/* 무한스크롤 트리거 */}
         {hasMore && (
            <div ref={setLoadingRef} className="flex justify-center p-4">
               {loading && (
                  <div className="flex items-center space-x-2">
                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-blue-300"></div>
                     <span>로딩 중...</span>
                  </div>
               )}
            </div>
         )}

         {/* 더 이상 데이터가 없을 때 */}
         {!hasMore && movers.length > 0 && (
            <div className="text-center py-8">
               <p className="text-gray-500">모든 기사님을 확인했습니다.</p>
            </div>
         )}

         {/* 데이터가 없을 때 */}
         {!loading && movers.length === 0 && (
            <div className="text-center py-8">
               <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
         )}
      </div>
   );
}