"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MoveChip from "../common/chips/MoveChip";
import MoveTextCard from "./common/MoveTextCard";
import { ChipType, DesignatedRequest, Estimate } from "@/lib/types";

export default function MoverEstimateCard(props: Estimate) {
   const estimate = props;
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const tab = searchParams.get("tab");

   console.log(estimate);

   const handleClick = () => {
      router.push(`${pathname}/${estimate.id}`);
   };

   return (
      <div
         onClick={() => {
            if (
               new Date(estimate.request.moveDate) > new Date() &&
               tab === "sent"
            ) {
               handleClick();
            }
         }}
         className={`relative rounded-2xl bg-white px-3.5 py-4 ${new Date(estimate.request.moveDate) > new Date() && tab === "sent" && "cursor-pointer"} ${tab !== "sent" || new Date(estimate.request.moveDate) < new Date() ? "after:absolute after:inset-0 after:h-full after:w-full after:rounded-2xl after:bg-black/50 after:content-[''] lg:px-6 lg:py-5" : ""} `}
         style={{
            boxShadow: `
               2px 2px 10px rgba(220, 220, 220, 0.14),
              -2px -2px 10px rgba(220, 220, 220, 0.14)
            `,
         }}
      >
         <div className="flex gap-1 md:gap-2 lg:gap-3">
            {estimate.isClientConfirmed && (
               <div className="w-fit rounded-sm bg-gray-800 px-1.5 py-0.5 lg:py-1">
                  <span className="text-13-semibold lg:text-16-semibold">
                     견적 확정
                  </span>
               </div>
            )}
            <MoveChip
               type={(estimate.request.moveType as ChipType) ?? "PENDING"}
            />
            {estimate.request.designatedRequest.some(
               (designatedRequest: DesignatedRequest) =>
                  designatedRequest.moverId === estimate.moverId,
            ) && <MoveChip type="DESIGNATED" />}
         </div>
         <div className="mt-3.5 md:flex md:flex-col md:gap-2.5 lg:mt-4 lg:gap-6">
            <span className="text-16-semibold lg:text-20-semibold">
               {estimate.request.client.name} 고객님
            </span>
            <div className="border-line-100 hidden w-full border-b md:block"></div>
            <div className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:gap-3.5 [&_div]:flex [&_div]:items-center">
               <div className="mt-3.5 gap-2 md:mt-0">
                  <MoveTextCard text="이사일" />
                  <span className="text-14-medium lg:text-18-medium">
                     {estimate.request.moveDate.slice(0, 10)} (
                     {
                        ["일", "월", "화", "수", "목", "금", "토"][
                           new Date(estimate.request.moveDate).getDay()
                        ]
                     }
                     )
                  </span>
               </div>
               <div className="border-line-100 w-full border-b md:!hidden"></div>
               <div className="gap-3.5">
                  <div className="gap-2">
                     <MoveTextCard text="출발" />
                     <span className="text-14-medium lg:text-18-medium">
                        {estimate.request.fromAddress.slice(0, 6)}
                     </span>
                  </div>
                  <div className="gap-2">
                     <MoveTextCard text="도착" />
                     <span className="text-14-medium lg:text-18-medium">
                        {estimate.request.toAddress.slice(0, 6)}
                     </span>
                  </div>
               </div>
            </div>
            {tab === "sent" && (
               <div className="mt-4 flex items-center justify-end gap-2 lg:mt-6 lg:gap-4">
                  <span className="text-14-medium lg:text-18-medium">
                     견적 금액
                  </span>
                  <span className="text-18-bold lg:text-24-bold">
                     {Number(estimate.price).toLocaleString()}원
                  </span>
               </div>
            )}
            {tab !== "sent" ||
            new Date(estimate.request.moveDate) < new Date() ? (
               <div className="absolute top-1/2 left-1/2 z-10 flex -translate-1/2 flex-col gap-4 text-white">
                  <span className="text-16-semibold lg:text-18-semibold">
                     {tab !== "sent"
                        ? "반려된 요청이에요"
                        : "이사 완료된 견적이에요"}
                  </span>
                  {tab === "sent" && (
                     <button onClick={handleClick}>견적 상세보기</button>
                  )}
               </div>
            ) : (
               <></>
            )}
         </div>
      </div>
   );
}
