"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MoveChip from "@/components/common/MoveChip";
import MoveTextCard from "@/components/domain/my-quotes/MoveTextCard";

export default function QuoteCard({ estimate }: { estimate: any }) {
   const router = useRouter();
   const pathname = usePathname();
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
      (d: any) => d.moverId === moverId,
   );
   const handleClick = () => {
      router.push(`${pathname}/${id}`);
   };

   return (
      <div
         onClick={() => {
            if (!isPastMoveDate && tab === "1") handleClick();
         }}
         className={`relative rounded-2xl bg-white px-3.5 py-4 ${!isPastMoveDate && tab === "1" && "cursor-pointer"} ${
            tab !== "1" || isPastMoveDate
               ? "after:absolute after:inset-0 after:h-full after:w-full after:rounded-2xl after:bg-black/50 after:content-[''] lg:px-6 lg:py-5"
               : ""
         }`}
      >
         <div className="flex gap-1 md:gap-2 lg:gap-3">
            {isClientConfirmed && (
               <div className="w-fit rounded-sm bg-gray-800 px-1.5 py-0.5 lg:py-1">
                  <span className="text-13-semibold lg:text-16-semibold">
                     견적 확정
                  </span>
               </div>
            )}
            <MoveChip type={moveType ?? "PENDING"} />
            {isDesignated && <MoveChip type="DESIGNATED" />}
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

            {(tab !== "1" || isPastMoveDate) && (
               <div className="absolute top-1/2 left-1/2 z-10 flex -translate-1/2 flex-col items-center gap-4 text-white">
                  <span className="text-16-semibold lg:text-18-semibold">
                     {tab !== "1"
                        ? "반려한 요청이에요"
                        : "이사 완료된 견적이에요"}
                  </span>
                  {tab === "1" && (
                     <button
                        className="border-primary-blue-200 lg:text-16-semibold text-14-semibold text-primary-blue-300 bg-primary-blue-100 w-fit rounded-2xl border px-4 py-2 lg:px-4.5 lg:py-2.5"
                        onClick={handleClick}
                     >
                        견적 상세보기
                     </button>
                  )}
               </div>
            )}
         </div>
      </div>
   );
}
