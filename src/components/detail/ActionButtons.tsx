import { Mover } from "@/lib/types/mover.types";

export default function ActionButtons({ mover }: { mover: Mover }) {
   return (
      <div className="p-4 lg:p-5">
         <div className="mb-4 text-center">
            <p className="mb-1 text-base font-medium text-gray-900">
               {mover.nickName} 기사님에게 지정 견적을 요청해보세요!
            </p>
         </div>

         <div className="space-y-3">
            <FavoriteButton
               moverId={mover.id}
               isFavorite={mover.isFavorite ?? false}
            />
            <EstimateRequestButton moverId={mover.id} />
         </div>
      </div>
   );
}

// 찜하기 버튼
function FavoriteButton({
   moverId,
   isFavorite,
}: {
   moverId: string;
   isFavorite: boolean;
}) {
   const handleClick = () => {
      alert(`찜 ${isFavorite ? "해제" : "추가"}: ${moverId}`);
   };

   return (
      <button
         onClick={handleClick}
         className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
         <span>♡</span>
         <span>기사님 찜하기</span>
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
