"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import MoveChip from "@/components/common/MoveChip";
import profile from "@/assets/images/profileUploaderIcon.svg";
import yellowStar from "@/assets/images/starFilledIcon.svg";
import grayStar from "@/assets/images/starOutlineIcon.svg";
import SolidButton from "@/components/common/SolidButton";
import { MyReview } from "@/lib/types";
import { formatIsoToYMD } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getMyReviews } from "@/lib/api/review/getMyReviews";
import Pagination from "@/components/common/pagination";
import { isChipType } from "@/lib/utils/moveChip.util";
import EmptyState from "@/components/common/EmptyState";

export default function MyReviews() {
   const router = useRouter();
   const [reviews, setReviews] = useState<MyReview[]>([]);
   const [pagination, setPagination] = useState(() => {
      let initialLimit = 6;
      // 첫 로딩 때 width로 limit값 결정
      if (typeof window !== "undefined" && window.innerWidth < 1440) {
         initialLimit = 4;
      }
      return {
         page: 1,
         limit: initialLimit,
         totalPages: 1,
      };
   });

   const handlePageChange = (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
   };

   useEffect(() => {
      async function fetchData() {
         try {
            const res = await getMyReviews(pagination.page, pagination.limit);
            setReviews(res.data.reviews);
            setPagination(res.data.pagination);
         } catch (error) {
            console.error(error);
         }
      }
      fetchData();
   }, [pagination.page, pagination.limit]);

   return (
      <div>
         {/* 리뷰 리스트 */}
         <div className="grid grid-cols-1 gap-8 lg:mb-6 lg:grid-cols-2 lg:gap-6">
            {reviews.map((review) => (
               <div
                  key={review.id}
                  className="border-line-100 relative h-54.5 w-full rounded-2xl border bg-white px-3.5 pt-5 pb-3.5 shadow-[2px_2px_10px_0px_rgba(220,220,220,0.10),_-2px_-2px_10px_0px_rgba(220,220,220,0.10)] md:mb-2 md:px-4 lg:mb-6 lg:h-86.5 lg:px-6 lg:py-8"
               >
                  <div className="mb-3.5 flex gap-2 lg:gap-3">
                     {isChipType(review.moveType) ? (
                        <MoveChip type={review.moveType} />
                     ) : null}
                     {review.isDesignatedEstimate && (
                        <MoveChip type={"DESIGNATED"} />
                     )}
                  </div>
                  <div className="text-12-regular lg:text-18-regular absolute right-3.5 bottom-2.5 gap-1.5 text-gray-300 lg:top-9 lg:right-9 lg:gap-2">
                     <span>작성일</span>
                     <span>{formatIsoToYMD(review.createdAt)}</span>
                  </div>
                  <div className="border-line-100 mb-3.5 flex w-full items-center rounded-md border-b-1 bg-white pb-2.5 shadow-[4px_4px_16px_0px_rgba(233,233,233,0.10)] md:px-2 lg:mb-8 lg:border lg:px-4.5 lg:py-6">
                     {/* 프로필 이미지 */}
                     <div className="border-primary-blue-400 relative mr-3 h-11.5 w-11.5 overflow-hidden rounded-full border-2 lg:mr-6 lg:h-24 lg:w-24">
                        <Image
                           src={review.moverProfileImage || profile}
                           alt="프로필"
                           fill
                           className="object-cover"
                        />
                     </div>
                     {/* 정보 영역 */}
                     <div className="flex-1">
                        <div className="flex items-center justify-between">
                           <span className="text-14-semibold lg:text-18-semibold text-black-300">
                              {review.moverNickname} 기사님
                           </span>
                        </div>
                        <div className="text-13-medium lg:text-16-medium mt-1.5 flex items-center text-gray-300 lg:mt-2">
                           <span className="flex items-center gap-1.5 lg:gap-3">
                              <span>이사일</span>
                              <span className="text-black-300">
                                 {formatIsoToYMD(review.moveDate)}
                              </span>
                           </span>
                           <span className="bg-line-200 mx-2.5 h-3 w-px lg:mx-4"></span>
                           <span className="flex items-center gap-0.5 lg:gap-1">
                              <span>견적가</span>
                              <span className="text-black-300">
                                 {review.price.toLocaleString()}원
                              </span>
                           </span>
                        </div>
                        <div className="hidden items-center lg:mt-4 lg:flex">
                           {Array(review.rating)
                              .fill(0)
                              .map((_, i) => (
                                 <Image
                                    key={i}
                                    src={yellowStar}
                                    width={24}
                                    height={24}
                                    alt="별점"
                                 />
                              ))}
                           {Array(5 - Number(review.rating))
                              .fill(0)
                              .map((_, i) => (
                                 <Image
                                    key={i}
                                    src={grayStar}
                                    width={24}
                                    height={24}
                                    alt="별점"
                                 />
                              ))}
                        </div>
                     </div>
                  </div>
                  <div className="text-14-regular lg:text-20-regular line-clamp-2 h-12 text-gray-500 lg:h-16">
                     {review.content}
                  </div>
               </div>
            ))}
         </div>
         <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
         />
         {reviews.length === 0 && (
            <div className="mt-46 flex flex-col items-center justify-center">
               <EmptyState message="아직 등록한 리뷰가 없어요!" />
               <SolidButton
                  className="my-6 max-w-45 lg:my-8"
                  onClick={() => router.replace("?tab=writable")}
               >
                  리뷰 작성하러 가기
               </SolidButton>
            </div>
         )}
      </div>
   );
}
