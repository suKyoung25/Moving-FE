"use client";

import React, { useMemo, useState } from "react";
import MoveChip from "@/components/common/MoveChip";
import Image from "next/image";
import profile from "@/assets/images/profileUploaderIcon.svg";
import SolidButton from "@/components/common/SolidButton";
import ReviewModal from "./ReviewModal";
import Pagination from "@/components/common/Pagination";
import EmptyState from "@/components/common/EmptyState";
import { useTranslations } from "next-intl";
import { isChipType } from "@/lib/utils/moveChip.util";
import { formatIsoToYMD } from "@/lib/utils";
import { WritableReview } from "@/lib/types";
import { useWritableReviews } from "@/lib/api/review/query";
import { useToast } from "@/context/ToastConText";
import { useQueryClient } from "@tanstack/react-query";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import WritableReviewSkeleton from "./WritableReviewSkeleton";

export default function WritableReviews() {
   const t = useTranslations("Reviews");
   const { showSuccess } = useToast();
   const queryClient = useQueryClient();
   // 페이지네이션 상태
   const [pagination, setPagination] = useState({
      page: 1,
      limit: 6,
      totalPages: 1,
   });
   // 선택된 estimate의 id를 저장
   const [selectedId, setSelectedId] = useState<string | null>(null);
   // 작성 가능한 리뷰 리스트
   const { data, isLoading, error, refetch } = useWritableReviews({
      page: pagination.page,
      limit: pagination.limit,
   });

   // 페이지네이션 핸들러
   const handlePageChange = (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
   };

   // 선택된 estimate 객체 찾기
   const selectedEstimate = useMemo(() => {
      return (
         data?.data.estimates.find((item) => item.estimateId === selectedId) ??
         null
      );
   }, [selectedId, data]);

   // 리뷰 작성 성공 시 상태 토글해서 refetch
   const handleReviewSuccess = () => {
      refetch();
      queryClient.refetchQueries({ queryKey: ["myReviews"] }); // myReview 리패칭
      showSuccess(t("reviewRegistered"));
   };

   const totalPages = data?.data.pagination.totalPages ?? pagination.totalPages;

   if (error) {
      return <div>{t("errorOccurred")}</div>;
   }

   if (isLoading) {
      return (
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            <SkeletonLayout
               count={6}
               SkeletonComponent={WritableReviewSkeleton}
            />
         </div>
      );
   }

   return (
      <div>
         <div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
            role="list"
            aria-label={t("writableReviewList")}
         >
            {(data?.data.estimates ?? []).map(
               (writableReview: WritableReview) => (
                  <div
                     key={writableReview.estimateId}
                     className="border-line-100 w-full rounded-2xl border bg-white px-3.5 pt-5 pb-3.5 shadow md:mb-2 md:px-4 lg:mb-6 lg:h-86.5 lg:px-6 lg:py-8"
                  >
                     <div className="mb-3.5 flex gap-2 lg:gap-3">
                        {isChipType(writableReview.moveType) ? (
                           <MoveChip
                              type={writableReview.moveType}
                              aria-label={t(
                                 `moveType.${writableReview.moveType}`,
                              )}
                           />
                        ) : null}
                        {writableReview.isDesignatedEstimate && (
                           <MoveChip
                              type={"DESIGNATED"}
                              aria-label={t("designatedEstimate")}
                           />
                        )}
                     </div>
                     <div className="border-line-100 mb-3.5 flex w-full items-center rounded-md bg-white md:px-2 lg:mb-8 lg:border lg:px-4.5 lg:py-6">
                        <div className="relative mr-3 h-11.5 w-11.5 overflow-hidden rounded-full lg:mr-6 lg:h-24 lg:w-24">
                           <Image
                              src={writableReview.moverProfileImage || profile}
                              alt={
                                 writableReview.moverProfileImage
                                    ? t("profileAlt", {
                                         name: writableReview.moverNickName,
                                      })
                                    : t("defaultProfileAlt")
                              }
                              fill
                              className="object-cover"
                           />
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center justify-between">
                              <h3
                                 id={`estimate-${writableReview.estimateId}-title`}
                                 className="text-14-semibold lg:text-18-semibold text-black-300"
                              >
                                 {writableReview.moverNickName} {t("mover")}
                              </h3>
                           </div>
                           <div className="text-13-medium lg:text-16-medium mt-3 flex flex-wrap items-center text-gray-300 lg:mt-4">
                              <span className="flex items-center gap-1.5 lg:gap-3">
                                 <span>{t("moveDate")}</span>
                                 <time
                                    className="text-black-300"
                                    dateTime={writableReview.moveDate}
                                 >
                                    {formatIsoToYMD(writableReview.moveDate)}
                                 </time>
                              </span>
                              <span
                                 className="bg-line-200 mx-2.5 h-3 w-px lg:mx-4"
                                 aria-hidden="true"
                              ></span>
                              <span className="flex items-center gap-1.5 lg:gap-3">
                                 <span>{t("price")}</span>
                                 <span className="text-black-300">
                                    {writableReview.price.toLocaleString()}
                                    {t("money")}
                                 </span>
                              </span>
                           </div>
                        </div>
                     </div>
                     <SolidButton
                        onClick={() => setSelectedId(writableReview.estimateId)}
                        aria-label={`${writableReview.moverNickName} ${t("writeReviewFor")}`}
                     >
                        {t("writeReview")}
                     </SolidButton>
                  </div>
               ),
            )}
         </div>

         {/* 페이지네이션 컴포넌트 */}
         <Pagination
            page={pagination.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            aria-label={t("paginationNav")}
         />

         {/* 리뷰 목록이 없을 때 */}
         {!isLoading && (data?.data.estimates.length ?? 0) === 0 && (
            <div
               className="flex flex-col items-center justify-center"
               role="status"
               aria-live="polite"
            >
               <EmptyState message={t("noWritableReviews")} />
            </div>
         )}

         {/* 리뷰 작성 모달 */}
         {selectedId && selectedEstimate && (
            <ReviewModal
               isOpen={true}
               onClose={() => setSelectedId(null)}
               selectedEstimate={selectedEstimate}
               onReviewSuccess={handleReviewSuccess}
            />
         )}
      </div>
   );
}
