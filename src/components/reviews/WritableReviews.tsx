"use client";

import React, { useEffect, useMemo, useState } from "react";
import MoveChip from "@/components/common/chips/MoveChip";
import Image from "next/image";
import profile from "@/assets/images/profileUploaderIcon.svg";
import SolidButton from "@/components/common/buttons/SolidButton";
import ReviewModal from "./ReviewModal";
import blueFolder from "@/assets/images/emptyBlueFolderIcon.svg";
import { isChipType, WritableReview } from "@/lib/types";
import { formatIsoToYMD } from "@/lib/utils";
import { getWritableReviews } from "@/lib/api/reviews/getWritableReviews";
import Pagination from "../common/pagination";

export default function WritableReviews() {
   // 작성 가능한 리뷰 목록
   const [writableReviews, setWritableReviews] = useState<WritableReview[]>([]);
   // 페이지네이션
   const [pagination, setPagination] = useState(() => {
      let initialLimit = 6;
      if (typeof window !== "undefined" && window.innerWidth < 1440) {
         initialLimit = 4;
      }
      return {
         page: 1,
         limit: initialLimit,
         totalPages: 1,
      };
   });
   // 선택된 estimate의 id를 저장
   const [selectedId, setSelectedId] = useState<string | null>(null);
   // 리뷰 작성 성공 여부
   const [reviewSubmitted, setReviewSubmitted] = useState(false);

   const handlePageChange = (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
   };

   useEffect(() => {
      async function fetchData() {
         try {
            const res = await getWritableReviews(
               pagination.page,
               pagination.limit,
            );
            setWritableReviews(res.data.estimates);
            setPagination(res.data.pagination);
         } catch (error) {
            console.error(error);
         }
      }
      fetchData();
   }, [pagination.page, pagination.limit, reviewSubmitted]);

   // id로 해당 estimate 객체 찾기
   const selectedEstimate = useMemo(() => {
      return writableReviews.find((item) => item.estimateId === selectedId);
   }, [selectedId, writableReviews]);

   return (
      <div>
         <div className="grid grid-cols-1 gap-8 lg:mb-6 lg:grid-cols-2 lg:gap-6">
            {writableReviews.map((writableReview) => (
               <div
                  key={writableReview.estimateId}
                  className="border-line-100 h-52 w-full rounded-2xl border bg-white px-3.5 pt-5 pb-3.5 shadow-[2px_2px_10px_0px_rgba(220,220,220,0.10),_-2px_-2px_10px_0px_rgba(220,220,220,0.10)] md:mb-2 md:px-4 lg:mb-6 lg:h-86.5 lg:px-6 lg:py-8"
               >
                  <div className="mb-3.5 flex gap-2 lg:gap-3">
                     {isChipType(writableReview.moveType) ? (
                        <MoveChip type={writableReview.moveType} />
                     ) : null}
                     {writableReview.isDesignatedEstimate && (
                        <MoveChip type={"DESIGNATED"} />
                     )}
                  </div>
                  <div className="border-line-100 mb-3.5 flex w-full items-center rounded-md bg-white shadow-[4px_4px_16px_0px_rgba(233,233,233,0.10)] md:px-2 lg:mb-8 lg:border lg:px-4.5 lg:py-6">
                     {/* 프로필 이미지 */}
                     <div className="border-primary-blue-400 relative mr-3 h-11.5 w-11.5 overflow-hidden rounded-full border-2 lg:mr-6 lg:h-24 lg:w-24">
                        <Image
                           src={writableReview.moverProfileImage || profile}
                           alt="프로필"
                           fill
                           className="object-cover"
                        />
                     </div>
                     {/* 정보 영역 */}
                     <div className="flex-1">
                        <div className="flex items-center justify-between">
                           <span className="text-14-semibold lg:text-18-semibold text-black-300">
                              {writableReview.moverNickName} 기사님
                           </span>
                        </div>
                        <div className="text-13-medium lg:text-16-medium mt-3 flex items-center text-gray-300 lg:mt-4">
                           <span className="flex items-center gap-1.5 lg:gap-3">
                              <span>이사일</span>
                              <span className="text-black-300">
                                 {formatIsoToYMD(writableReview.moveDate)}
                              </span>
                           </span>
                           <span className="bg-line-200 mx-2.5 h-3 w-px lg:mx-4"></span>
                           <span className="flex items-center gap-1.5 lg:gap-3">
                              <span>견적가</span>
                              <span className="text-black-300">
                                 {writableReview.price.toLocaleString()}원
                              </span>
                           </span>
                        </div>
                     </div>
                  </div>
                  <SolidButton
                     onClick={() => setSelectedId(writableReview.estimateId)}
                  >
                     리뷰 작성하기
                  </SolidButton>
               </div>
            ))}
         </div>
         <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
         />
         {writableReviews.length === 0 && (
            <div className="mt-46 flex flex-col items-center justify-center">
               <Image
                  src={blueFolder}
                  width={184}
                  height={136}
                  alt="빈 화면"
                  className="h-20.5 w-27.5 lg:h-34 lg:w-46"
               />
               <div className="text-16-regular lg:text-24-regular my-6 text-gray-400 lg:my-8">
                  작성 가능한 리뷰가 없어요
               </div>
            </div>
         )}
         {selectedId && selectedEstimate && (
            <ReviewModal
               isOpen={true}
               onClose={() => setSelectedId(null)}
               selectedEstimate={selectedEstimate}
               onReviewSuccess={() => setReviewSubmitted((prev) => !prev)}
            />
         )}
      </div>
   );
}
