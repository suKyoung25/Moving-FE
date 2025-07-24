import React from "react";
import Image from "next/image";
import MoveChip from "@/components/common/MoveChip";
import profile from "@/assets/images/profileUploaderIcon.svg";
import yellowStar from "@/assets/images/starFilledIcon.svg";
import grayStar from "@/assets/images/starOutlineIcon.svg";
import { WritableReview } from "@/lib/types";
import { formatIsoToYMD } from "@/lib/utils";
import { isChipType } from "@/lib/utils/moveChip.util";

type ReviewFormBodyProps = {
   estimate: WritableReview;
   rating: number;
   setRating: (n: number) => void;
   hovered: number | null;
   setHovered: (n: number | null) => void;
   content: string;
   setContent: (v: string) => void;
};

export function ReviewFormBody({
   estimate,
   rating,
   setRating,
   hovered,
   setHovered,
   content,
   setContent,
}: ReviewFormBodyProps) {
   return (
      <>
         {/* 카드 정보 */}
         <div className="mb-3.5 flex gap-2 lg:gap-3">
            {isChipType(estimate.moveType) && (
               <MoveChip type={estimate.moveType} />
            )}
            {estimate.isDesignatedEstimate && <MoveChip type="DESIGNATED" />}
         </div>
         <div className="border-line-100 mb-3.5 flex w-full items-center rounded-md bg-white shadow-[4px_4px_16px_0px_rgba(233,233,233,0.10)] md:px-2 lg:mb-8 lg:border lg:px-4.5 lg:py-6">
            {/* 프로필 이미지 */}
            <div className="border-primary-blue-400 relative mr-3 h-11.5 w-11.5 overflow-hidden rounded-full border-2 lg:mr-6 lg:h-24 lg:w-24">
               <Image
                  src={estimate.moverProfileImage || profile}
                  alt="프로필"
                  fill
                  className="object-cover"
               />
            </div>
            {/* 견적 상세 정보 */}
            <div className="flex-1">
               <div className="flex items-center justify-between">
                  <span className="text-14-semibold lg:text-18-semibold text-black-300">
                     {estimate.moverNickname} 기사님
                  </span>
               </div>
               <div className="text-13-medium lg:text-16-medium mt-3 flex items-center text-gray-300 lg:mt-4">
                  <span className="flex items-center gap-1.5 lg:gap-3">
                     <span className="bg-bg-400 rounded-sm px-1 py-0.5 lg:px-1.5 lg:py-1">
                        이사일
                     </span>
                     <span className="text-black-300">
                        {formatIsoToYMD(estimate.moveDate)}
                     </span>
                  </span>
                  <span className="bg-line-200 mx-2.5 h-3 w-px lg:mx-4"></span>
                  <span className="flex items-center gap-1.5 lg:gap-3">
                     <span className="bg-bg-400 rounded-sm px-1 py-0.5 lg:px-1.5 lg:py-1">
                        견적가
                     </span>
                     <span className="text-black-300">
                        {estimate.price.toLocaleString()}원
                     </span>
                  </span>
               </div>
            </div>
         </div>
         <hr className="bg-line-100 my-5 h-px w-full border-0 lg:hidden" />
         {/* 별점 */}
         <div>
            <span className="text-16-semibold lg:text-20-semibold">
               평점을 선택해 주세요
            </span>
            <div className="mt-4 mb-6 flex gap-1">
               {[1, 2, 3, 4, 5].map((star) => (
                  <button
                     key={star}
                     type="button"
                     onClick={() => setRating(star)}
                     onMouseEnter={() => setHovered(star)}
                     onMouseLeave={() => setHovered(null)}
                     className="focus:outline-none"
                     aria-label={`${star}점`}
                  >
                     <Image
                        src={
                           star <= (hovered ?? rating) ? yellowStar : grayStar
                        }
                        alt={star <= (hovered ?? rating) ? "노란별" : "회색별"}
                        width={48}
                        height={48}
                        className="h-6 w-6 lg:h-12 lg:w-12"
                     />
                  </button>
               ))}
            </div>
            <hr className="bg-line-100 my-5 h-px w-full border-0 lg:my-8" />
         </div>
         {/* 후기 입력 */}
         <div>
            <div className="text-16-semibold lg:text-20-semibold mb-4">
               상세 후기를 작성해 주세요
            </div>
            <textarea
               className="bg-bg-200 h-40 w-full resize-none rounded-2xl px-4 py-3.5"
               placeholder="최소 10자 이상 입력해 주세요"
               value={content}
               onChange={(e) => setContent(e.target.value)}
            />
         </div>
      </>
   );
}
