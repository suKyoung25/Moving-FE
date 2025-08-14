"use client";

import React, { useEffect, useState } from "react";
import { ReviewFormBody } from "./ReviewFormBody";
import { WritableReview, MyReview } from "@/lib/types";
import InputModal from "@/components/common/InputModal";
import { useForm } from "react-hook-form";
import {
   UpdateReviewDto,
   useReviewSchemas,
} from "@/lib/schemas/reviews.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractErrorMessage } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useUpdateReview, useDeleteReview } from "@/lib/api/review/mutation";
import SolidButton from "@/components/common/SolidButton";
import ConfirmModal from "@/components/common/ConfirmModal";
import updateProfileImage from "@/lib/api/auth/requests/updateProfileImage";

interface EditDeleteReviewModalProps {
   isOpen: boolean;
   onClose: () => void;
   review: MyReview;
   onSuccess?: () => void;
}

export default function EditDeleteReviewModal({
   isOpen,
   onClose,
   review,
   onSuccess,
}: EditDeleteReviewModalProps) {
   const t = useTranslations("Reviews");
   const { updateReviewSchema } = useReviewSchemas();

   const {
      handleSubmit,
      setValue,
      reset,
      control,
      formState: { errors },
      watch,
   } = useForm<UpdateReviewDto>({
      resolver: zodResolver(updateReviewSchema),
      defaultValues: {
         rating: review.rating,
         content: review.content,
         images: review.images || [],
      },
   });

   const [apiMessage, setApiMessage] = useState("");
   const [hovered, setHovered] = useState<number | null>(null);
   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
   const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   // 수정
   const updateMutation = useUpdateReview({
      onSuccess: () => {
         onClose();
         onSuccess?.();
         reset();
         setHovered(null);
         setApiMessage("");
      },
      onError: (error) => {
         setApiMessage(extractErrorMessage(error, t("editError")));
      },
   });

   // 삭제
   const deleteMutation = useDeleteReview({
      onSuccess: () => {
         onClose();
         onSuccess?.();
      },
      onError: (error) => {
         setApiMessage(extractErrorMessage(error, t("deleteError")));
      },
   });

   useEffect(() => {
      if (isOpen && review) {
         reset({
            rating: review.rating,
            content: review.content,
            images: review.images || [],
         });
         setApiMessage("");
         setHovered(null);
         setIsDeleteConfirmOpen(false); // 모달 처음 열릴 때는 확인 모달 닫힘
         setIsEditConfirmOpen(false);
      }
   }, [isOpen, review, reset]);

   const rating = watch("rating") ?? 0;
   const content = watch("content") ?? "";
   const isActive = rating > 0 && content.length >= 10;

   if (!isOpen) return null;

   // 폼 유효성 검사 및 제출 함수
   const onSubmit = async (data: UpdateReviewDto) => {
      setApiMessage("");
      setIsLoading(true);

      try {
         // 이미지가 있으면 먼저 업로드
         const uploadedImageUrls: string[] = [];

         if (data.images && data.images.length > 0) {
            for (const imageData of data.images) {
               if (imageData.startsWith("data:image")) {
                  // Base64 이미지를 File로 변환
                  const response = await fetch(imageData);
                  const blob = await response.blob();
                  const file = new File([blob], "review-image.png", {
                     type: "image/png",
                  });

                  const formData = new FormData();
                  formData.append("image", file);

                  const res = await updateProfileImage(formData);
                  uploadedImageUrls.push(res.url);
               } else {
                  // 이미 URL인 경우
                  uploadedImageUrls.push(imageData);
               }
            }
         }

         // 이미지 처리 후 나머지 데이터 처리
         const processedData = {
            ...data,
            images: uploadedImageUrls,
         };

         updateMutation.mutate({ reviewId: review.id, ...processedData });
      } catch (error) {
         console.error("이미지 업로드 실패: ", error);
         setApiMessage(t("imageUploadError"));
      } finally {
         setIsLoading(false);
      }
   };

   // 폼 제출 이벤트 핸들러: 실제 제출 지연시키고 확인 모달 띄움
   const onFormSubmit = (event: React.FormEvent) => {
      event.preventDefault(); // 폼 제출 기본동작 차단
      const rating = watch("rating") ?? 0;
      const content = watch("content") ?? "";
      const images = watch("images") ?? [];

      // 변경사항 없는 경우
      if (
         rating === review.rating &&
         content === review.content &&
         JSON.stringify(images) === JSON.stringify(review.images)
      ) {
         setApiMessage(t("noChangesError"));
         // 수정 확인 모달은 열지 않음
         return;
      }

      setApiMessage("");
      setIsEditConfirmOpen(true); // 확인 모달 열기
   };

   const handleDelete = () => {
      setApiMessage("");
      deleteMutation.mutate(review.id);
      closeDeleteConfirmModal();
   };

   const openDeleteConfirmModal = () => setIsDeleteConfirmOpen(true);
   const closeDeleteConfirmModal = () => setIsDeleteConfirmOpen(false);
   const closeEditConfirmModal = () => setIsEditConfirmOpen(false);

   const loading = updateMutation.isPending || deleteMutation.isPending;

   const modalTitleId = "edit-delete-modal-title";

   return (
      <form onSubmit={onFormSubmit} aria-labelledby={modalTitleId}>
         <InputModal
            isOpen={isOpen && !isDeleteConfirmOpen && !isEditConfirmOpen}
            onClose={() => {
               onClose();
               reset();
               setApiMessage("");
               setHovered(null);
            }}
            aria-modal="true"
            aria-labelledby={modalTitleId}
            title={t("editDelete")}
            buttonTitle={
               loading
                  ? updateMutation.isPending
                     ? t("editting")
                     : t("deleting")
                  : t("editReview")
            }
            isActive={isActive && !loading && !isLoading}
            isConfirmOpen={isDeleteConfirmOpen && isEditConfirmOpen}
         >
            <ReviewFormBody
               estimate={review as WritableReview}
               rating={rating}
               setRating={(v: number) =>
                  setValue("rating", v, { shouldValidate: true })
               }
               hovered={hovered}
               setHovered={setHovered}
               content={content}
               setContent={(val: string) =>
                  setValue("content", val, { shouldValidate: true })
               }
               errorRating={errors.rating?.message}
               errorContent={errors.content?.message}
               control={control}
            />
            {apiMessage && (
               <div
                  className="mb-2 text-red-600"
                  role="alert"
                  aria-live="assertive"
               >
                  {apiMessage}
               </div>
            )}
            <SolidButton
               type="button"
               className="mt-2 w-full bg-red-500"
               disabled={loading}
               onClick={openDeleteConfirmModal}
               aria-label={t("deleteReview")}
            >
               {deleteMutation.isPending && isLoading
                  ? t("deleting")
                  : t("deleteReview")}
            </SolidButton>
         </InputModal>

         {/* 삭제 확인 모달 */}
         <ConfirmModal
            isOpen={isDeleteConfirmOpen}
            onClose={closeDeleteConfirmModal}
            title={t("deleteConfirmTitle")}
            description={t("deleteConfirmDescription")}
            onConfirm={handleDelete}
         />

         {/* 수정 확인 모달 */}
         <ConfirmModal
            isOpen={isEditConfirmOpen}
            onClose={closeEditConfirmModal}
            title={t("editConfirmTitle")}
            description={t("editConfirmDescription")}
            onConfirm={handleSubmit(onSubmit)}
         />
      </form>
   );
}
