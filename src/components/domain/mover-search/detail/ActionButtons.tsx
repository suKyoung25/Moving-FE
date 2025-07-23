"use client";

import { useState, useEffect } from "react";
import { Mover } from "@/lib/types/mover.types";
import { toggleFavoriteMover } from "@/lib/api/mover";
import { tokenSettings } from "@/lib/utils/auth.util";

export default function ActionButtons({ mover }: { mover: Mover }) {
   return (
      <div className="p-4 lg:p-5">
         <div className="mb-4 text-center">
            <p className="mb-1 text-base font-medium text-gray-900">
               {mover.nickName} 기사님에게 지정 견적을 요청해보세요!
            </p>
         </div>

         <div className="space-y-3">
            <FavoriteButton mover={mover} />
            <EstimateRequestButton moverId={mover.id} />
         </div>
      </div>
   );
}

// 찜하기 버튼 (토글 기능)
function FavoriteButton({ mover }: { mover: Mover }) {
   const [isLoading, setIsLoading] = useState(false);
   // ✅ 서버에서 받은 실제 데이터로 초기화
   const [isFavorite, setIsFavorite] = useState(mover.isFavorite ?? false);
   const [favoriteCount, setFavoriteCount] = useState(mover.favoriteCount ?? 0);

   // ✅ mover 데이터가 변경되면 상태 업데이트
   useEffect(() => {
      setIsFavorite(mover.isFavorite ?? false);
      setFavoriteCount(mover.favoriteCount ?? 0);
   }, [mover.isFavorite, mover.favoriteCount]);

   const handleClick = async () => {
      if (isLoading) return;

      const token = tokenSettings.get();
      if (!token) {
         alert("로그인이 필요합니다.");
         return;
      }

      setIsLoading(true);
      
      try {
         const result = await toggleFavoriteMover(mover.id, token as string);
         
         // 서버 응답으로 UI 업데이트
         setIsFavorite(result.isFavorite);
         setFavoriteCount(result.favoriteCount);
         
         const message = result.action === 'added' ? '찜 목록에 추가되었습니다.' : '찜 목록에서 제거되었습니다.';
         console.log(message); // alert 대신 console.log로 변경 (UX 개선)
         
      } catch (error) {
         console.error("찜 처리 실패:", error);
         const errorMessage = error instanceof Error ? error.message : "찜 처리 중 오류가 발생했습니다.";
         alert(errorMessage);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <button
         onClick={handleClick}
         disabled={isLoading}
         className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium transition-colors ${
            isLoading 
               ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
               : isFavorite
                  ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
         }`}
      >
         <span className="text-lg">{isFavorite ? '❤️' : '🤍'}</span>
         <span>
            {isLoading 
               ? '처리 중...' 
               : isFavorite 
                  ? '찜 해제하기' 
                  : '기사님 찜하기'
            }
         </span>
         <span className="text-sm text-gray-500">({favoriteCount})</span>
      </button>
   );
}

// 견적 요청 버튼
function EstimateRequestButton({ moverId }: { moverId: string }) {
   const handleClick = () => {
      alert(`견적 요청: ${moverId}`);
   };

   return (
      <button
         onClick={handleClick}
         className="w-full rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600"
      >
         지정 견적 요청하기
      </button>
   );
}