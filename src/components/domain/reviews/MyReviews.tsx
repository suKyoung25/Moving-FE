"use client";

import React, { useState } from "react";
import Image from "next/image";
import MoveChip from "@/components/common/MoveChip";
import profile from "@/assets/images/profileUploaderIcon.svg";
import yellowStar from "@/assets/images/starFilledIcon.svg";
import grayStar from "@/assets/images/starOutlineIcon.svg";
import SolidButton from "@/components/common/SolidButton";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/common/EmptyState";
import EditDeleteReviewModal from "./EditDeleteReviewModal";
import more from "@/assets/images/moreGrayIcon.svg";
import { useLocale, useTranslations } from "next-intl";
import { isChipType } from "@/lib/utils/moveChip.util";
import { formatIsoToYMD } from "@/lib/utils";
import { MyReview } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMyReviews } from "@/lib/api/review/query";
import { useToast } from "@/context/ToastConText";
import { useQueryClient } from "@tanstack/react-query";

export default function MyReviews() {
   const t = useTranslations("Reviews");
   const locale = useLocale();
   const router = useRouter();
   const { showSuccess } = useToast();
   const queryClient = useQueryClient();

   // 페이지네이션 상태
   const [pagination, setPagination] = useState({
      page: 1,
      limit: 6,
      totalPages: 1,
   });

   // 수정 모달 및 선택된 리뷰 상태
   const [editModalOpen, setEditModalOpen] = useState(false);
   const [selectedReview, setSelectedReview] = useState<MyReview | null>(null);

   const targetLang = locale === "en" ? "en-US" : locale;

   // 리뷰 리스트 조회
   const { data, isLoading, isFetching, error, refetch } = useMyReviews({
      page: pagination.page,
      limit: pagination.limit,
      targetLang,
   });

   // 페이지네이션 핸들러
   const handlePageChange = (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
   };

   // 리뷰 수정/삭제 완료 시 리스트 새로고침
   const handleRefresh = () => {
      refetch();
      queryClient.refetchQueries({ queryKey: ["writableReviews"] }); // writableReviews 리패칭
      showSuccess(t("reviewModifiedSuccess"));
   };

   // 리뷰 목록
   const reviews: MyReview[] = data?.data.reviews ?? [];
   const totalPages = data?.data.pagination.totalPages ?? pagination.totalPages;

   if (error) {
      return <div>{t("errorOccurred")}</div>;
   }

   if (isLoading || isFetching) {
      return <div>{t("loadingText")}</div>;
   }

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
                  <div className="text-12-regular lg:text-18-regular absolute right-3.5 bottom-2.5 h-fit gap-1.5 text-gray-300 lg:top-9 lg:right-9 lg:gap-2">
                     <span>{t("createdAt")} </span>
                     <span>{formatIsoToYMD(review.createdAt)}</span>
                  </div>
                  <div className="border-line-100 mb-3.5 flex w-full items-center rounded-md border-b-1 bg-white pb-2.5 shadow-[4px_4px_16px_0px_rgba(233,233,233,0.10)] md:px-2 lg:mb-8 lg:border lg:px-4.5 lg:py-6">
                     {/* 프로필 이미지 */}
                     <div className="border-primary-blue-400 relative mr-3 h-11.5 w-11.5 overflow-hidden rounded-full border-2 lg:mr-6 lg:h-24 lg:w-24">
                        <Image
                           src={review.moverProfileImage || profile}
                           alt={t("profileAlt")}
                           className="object-cover"
                        />
                     </div>
                     {/* 정보 영역 */}
                     <div className="flex-1">
                        <div className="flex items-center justify-between">
                           <span className="text-14-semibold lg:text-18-semibold text-black-300">
                              {review.moverNickName} {t("mover")}
                           </span>
                           <button
                              onClick={() => {
                                 setEditModalOpen(true);
                                 setSelectedReview(review);
                              }}
                              className="h-6 w-6"
                           >
                              <Image
                                 src={more}
                                 width={24}
                                 height={24}
                                 alt={t("editDeleteAlt")}
                                 style={{ transform: "rotate(90deg)" }}
                              />
                           </button>
                        </div>
                        <div className="text-13-medium lg:text-16-medium mt-1.5 flex items-center text-gray-300 lg:mt-2">
                           <span className="flex items-center gap-1.5 lg:gap-3">
                              <span>{t("moveDate")}</span>
                              <span className="text-black-300">
                                 {formatIsoToYMD(review.moveDate)}
                              </span>
                           </span>
                           <span className="bg-line-200 mx-2.5 h-3 w-px lg:mx-4"></span>
                           <span className="flex items-center gap-0.5 lg:gap-1">
                              <span>{t("price")} </span>
                              <span className="text-black-300">
                                 {review.price.toLocaleString()}
                                 {t("money")}
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
                                    alt={t("yellowStarAlt")}
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
                                    alt={t("grayStarAlt")}
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

         {/* 페이지네이션 */}
         <Pagination
            page={pagination.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
         />

         {/* 리뷰 목록이 없을 때 */}
         {!isLoading && reviews.length === 0 && (
            <div className="mt-46 flex flex-col items-center justify-center">
               <EmptyState message={t("noReview")} />
               <SolidButton
                  className="my-6 max-w-45 lg:my-8"
                  onClick={() => router.replace("?tab=writable")}
               >
                  {t("goToWrite")}
               </SolidButton>
            </div>
         )}

         {/* 수정/삭제 모달 */}
         {selectedReview && (
            <EditDeleteReviewModal
               isOpen={editModalOpen}
               onClose={() => {
                  setEditModalOpen(false);
                  setSelectedReview(null);
               }}
               review={selectedReview}
               onSuccess={() => {
                  setEditModalOpen(false);
                  setSelectedReview(null);
                  handleRefresh();
               }}
            />
         )}
      </div>
   );
}
