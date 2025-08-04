"use client";

import { useRouter, useSearchParams } from "next/navigation";
import MoveChip, { ChipType } from "@/components/common/MoveChip";
import MoveTextCard from "@/components/domain/my-quotes/MoveTextCard";
import { MyEstimateDetail } from "@/lib/types";

export default function QuoteCard({
   estimate,
   onRequestCancel,
}: {
   estimate: MyEstimateDetail;
   onRequestCancel: (id: string) => void;
}) {
   const router = useRouter();
   const searchParams = useSearchParams();
   const tab = searchParams.get("tab");

   const { request, moverId, isClientConfirmed, price, id } = estimate;
   const {
      moveDate,
      moveType,
      client,
      fromAddress,
      toAddress,
      designatedRequest,
   } = request;

   const isPastMoveDate = new Date(moveDate) < new Date();
   const isDesignated = designatedRequest.some(
      (d: { moverId: string }) => d.moverId === moverId,
   );

   const handleCardClick = () => {
      router.push(`/my-quotes/mover/${id}`);
   };

   return (
      <div
         onClick={!isPastMoveDate ? handleCardClick : undefined}
         className={`relative rounded-2xl bg-white px-3.5 py-4 ${
            !isPastMoveDate && "cursor-pointer"
         } ${
            isPastMoveDate
               ? "after:absolute after:inset-0 after:h-full after:w-full after:rounded-2xl after:bg-black/50 after:content-[''] lg:px-6 lg:py-5"
               : ""
         }`}
      >
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 md:gap-2">
               {isClientConfirmed && (
                  <div className="w-fit rounded-sm bg-gray-800 px-1.5 py-0.5 lg:py-1">
                     <span className="text-13-semibold lg:text-16-semibold">
                        견적 확정
                     </span>
                  </div>
               )}
               <MoveChip type={(moveType as ChipType) ?? "PENDING"} />
               {isDesignated && <MoveChip type="DESIGNATED" />}
            </div>

            {!isPastMoveDate && !isClientConfirmed && (
               <button
                  className="text-12-regular lg:text-14-regular text-gray-400"
                  onClick={(e) => {
                     e.stopPropagation();
                     onRequestCancel(id); // 상위에서 모달 오픈 처리
                  }}
               >
                  취소하기
               </button>
            )}
         </div>

         <div className="mt-3.5 md:flex md:flex-col md:gap-2.5 lg:mt-4 lg:gap-6">
            <span className="text-16-semibold lg:text-20-semibold">
               {client.name} 고객님
            </span>
            <div className="border-line-100 hidden w-full border-b md:block"></div>

            <div className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:gap-3.5 [&_div]:flex [&_div]:items-center">
               <div className="mt-3.5 gap-2 md:mt-0">
                  <MoveTextCard text="이사일" />
                  <span className="text-14-medium lg:text-18-medium">
                     {moveDate.slice(0, 10)} (
                     {"일월화수목금토"[new Date(moveDate).getDay()]})
                  </span>
               </div>
               <div className="border-line-100 w-full border-b md:!hidden"></div>
               <div className="gap-3.5">
                  <div className="gap-2">
                     <MoveTextCard text="출발" />
                     <span className="text-14-medium lg:text-18-medium">
                        {fromAddress.slice(0, 6)}
                     </span>
                  </div>
                  <div className="gap-2">
                     <MoveTextCard text="도착" />
                     <span className="text-14-medium lg:text-18-medium">
                        {toAddress.slice(0, 6)}
                     </span>
                  </div>
               </div>
            </div>

            {tab === "1" && (
               <div className="mt-4 flex items-center justify-end gap-2 lg:mt-6 lg:gap-4">
                  <span className="text-14-medium lg:text-18-medium">
                     견적 금액
                  </span>
                  <span className="text-18-bold lg:text-24-bold">
                     {Number(price).toLocaleString()}원
                  </span>
               </div>
            )}

            {isPastMoveDate && (
               <div className="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-white lg:gap-3">
                  <span className="text-16-semibold lg:text-18-semibold">
                     이사 완료된 견적이에요
                  </span>
                  <button
                     className="border-primary-blue-200 lg:text-16-semibold text-14-semibold text-primary-blue-300 bg-primary-blue-100 w-fit rounded-2xl border px-4 py-2 lg:px-4.5 lg:py-2.5"
                     onClick={handleCardClick}
                  >
                     견적 상세보기
                  </button>
               </div>
            )}
         </div>
      </div>
   );
}
