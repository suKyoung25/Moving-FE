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
import ReviewImages from "./ReviewImages";
import more from "@/assets/images/moreGrayIcon.svg";
import { useLocale, useTranslations } from "next-intl";
import { isChipType } from "@/lib/utils/moveChip.util";
import { formatIsoToYMD } from "@/lib/utils";
import { MyReview } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMyReviews } from "@/lib/api/review/query";
import { useToast } from "@/context/ToastConText";
import { useQueryClient } from "@tanstack/react-query";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import MyReviewsSkeleton from "./MyReviewsSkeleton";

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

   // 리뷰 리스트 조회
   const { data, isLoading, isFetching, error, refetch } = useMyReviews({
      page: pagination.page,
      limit: pagination.limit,
      targetLang: locale,
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
      return <div role="alert">{t("errorOccurred")}</div>;
   }

   if (isLoading || isFetching) {
      return (
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            <SkeletonLayout count={6} SkeletonComponent={MyReviewsSkeleton} />
         </div>
      );
   }

   return (
      <div>
         {/* 리뷰 리스트 */}
         <div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
            role="list"
            aria-label={t("myReviewList")}
         >
            {reviews.map((review) => (
               <div
                  key={review.id}
                  role="listitem"
                  className="border-line-100 rounded-2xl border bg-white p-4 shadow lg:p-6"
               >
                  <div className="mb-3.5 flex gap-2 lg:gap-3">
                     {isChipType(review.moveType) && (
                        <MoveChip
                           type={review.moveType}
                           aria-label={t(`moveType.${review.moveType}`)}
                        />
                     )}
                     {review.isDesignatedEstimate && (
                        <MoveChip
                           type="DESIGNATED"
                           aria-label={t("designatedEstimate")}
                        />
                     )}
                  </div>
                  <div className="text-12-regular lg:text-18-regular absolute right-3.5 bottom-2.5 h-fit gap-1.5 text-gray-300 lg:top-9 lg:right-9 lg:gap-2">
                     <span>{t("createdAt")} </span>
                     <time dateTime={formatIsoToYMD(review.createdAt)}>
                        {formatIsoToYMD(review.createdAt)}
                     </time>
                  </div>
                  <div className="border-line-100 mb-3.5 flex w-full items-center rounded-md border-b-1 bg-white pb-2.5 md:px-2 lg:mb-8 lg:border lg:px-4.5 lg:py-6">
                     {/* 프로필 이미지 */}
                     <div className="relative mr-3 h-11.5 w-11.5 overflow-hidden rounded-full lg:mr-6 lg:h-24 lg:w-24">
                        <Image
                           src={review.moverProfileImage || profile}
                           alt={
                              review.moverProfileImage
                                 ? t("profileAlt", {
                                      name: review.moverNickName,
                                   })
                                 : t("defaultProfileAlt")
                           }
                           fill
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
                                 setSelectedReview(review);
                                 setEditModalOpen(true);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                              aria-label={t("editDeleteAria")}
                           >
                              <Image
                                 src={more}
                                 alt={t("editDeleteAlt")}
                                 width={24}
                                 height={24}
                                 style={{ transform: "rotate(90deg)" }}
                              />
                           </button>
                        </div>
                        <div className="text-13-medium lg:text-16-medium mt-1.5 flex items-center text-gray-300 lg:mt-2">
                           <span className="flex items-center gap-1.5 lg:gap-3">
                              <span className="bg-bg-400 rounded-sm px-1 py-0.5 lg:px-1.5 lg:py-1">
                                 {t("moveDate")}
                              </span>
                              <time
                                 className="text-black-300"
                                 dateTime={review.moveDate}
                              >
                                 {formatIsoToYMD(review.moveDate)}
                              </time>
                           </span>
                           <span
                              className="bg-line-200 mx-2.5 hidden h-3 w-px sm:block lg:mx-4"
                              aria-hidden="true"
                           ></span>
                           <span className="flex items-center gap-1.5 lg:gap-3">
                              <span className="bg-bg-400 rounded-sm px-1 py-0.5 lg:px-1.5 lg:py-1">
                                 {t("price")}
                              </span>
                              <span
                                 className="text-black-300"
                                 aria-label={`${review.price.toLocaleString()} ${t("money")}`}
                              >
                                 {review.price.toLocaleString()}
                                 {t("money")}
                              </span>
                           </span>
                        </div>
                        {/* 별점 */}
                        <div
                           className="hidden items-center lg:mt-4 lg:flex"
                           role="img"
                           aria-label={t("ratingAria", {
                              rating: review.rating,
                           })}
                        >
                           {Array(review.rating)
                              .fill(0)
                              .map((_, i) => (
                                 <Image
                                    key={i}
                                    src={yellowStar}
                                    width={24}
                                    height={24}
                                    alt={t("yellowStarAlt")}
                                    aria-hidden="true"
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
                                    aria-hidden="true"
                                 />
                              ))}
                        </div>
                     </div>
                  </div>
                  <div className="text-14-regular lg:text-20-regular line-clamp-2 h-12 text-gray-500 lg:h-16">
                     {review.content}
                  </div>

                  {/* 리뷰 이미지 */}
                  <ReviewImages
                     images={review.images}
                     className="mt-4"
                     aria-label={t("reviewImagesAria", {
                        name: review.moverNickName,
                     })}
                  />
               </div>
            ))}
         </div>

         {/* 페이지네이션 */}
         <Pagination
            page={pagination.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            aria-label={t("paginationNav")}
         />

         {/* 리뷰 목록이 없을 때 */}
         {!isLoading && reviews.length === 0 && (
            <div
               className="flex flex-col items-center justify-center"
               role="status"
               aria-live="polite"
            >
               <EmptyState message={t("noReview")} />
               <SolidButton
                  onClick={() => router.push("/reviews")}
                  className="mt-4"
                  aria-label={t("goToWrite")}
               >
                  {t("goToWrite")}
               </SolidButton>
            </div>
         )}

         {/* 리뷰 수정/삭제 모달 */}
         {editModalOpen && selectedReview && (
            <EditDeleteReviewModal
               isOpen={editModalOpen}
               onClose={() => {
                  setEditModalOpen(false);
                  setSelectedReview(null);
               }}
               review={selectedReview}
               onSuccess={handleRefresh}
            />
         )}
      </div>
   );
}
