import InputModal from "@/components/common/InputModal";
import SolidButton from "@/components/common/SolidButton";
import { deleteReview } from "@/lib/api/review/deleteReview";
import { updateReview } from "@/lib/api/review/updateReview";
import {
   UpdateReviewDto,
   updateReviewSchema,
} from "@/lib/schemas/reviews.schema";
import { MyReview } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ReviewFormBody } from "./ReviewFormBody";
import { extractErrorMessage } from "@/lib/utils";

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
   const {
      handleSubmit,
      setValue,
      reset,
      formState: { errors, isSubmitting },
      watch,
   } = useForm<UpdateReviewDto>({
      resolver: zodResolver(updateReviewSchema),
      defaultValues: {
         rating: review.rating,
         content: review.content,
      },
   });

   const [apiMessage, setApiMessage] = useState("");
   const [deleteLoading, setDeleteLoading] = useState(false);
   const [hovered, setHovered] = useState<number | null>(null);

   useEffect(() => {
      if (isOpen && review) {
         reset({ rating: review.rating, content: review.content });
         setApiMessage("");
      }
   }, [isOpen, review, reset]);

   // 수정
   const onSubmit = async (data: UpdateReviewDto) => {
      setApiMessage("");
      try {
         await updateReview(review.id, data);
         onClose();
         onSuccess?.();
      } catch (error: unknown) {
         setApiMessage(extractErrorMessage(error, "리뷰 수정 실패"));
      }
   };

   //삭제
   const handleDelete = async () => {
      if (!window.confirm("리뷰를 정말 삭제하시겠습니까?")) return;
      setDeleteLoading(true);
      setApiMessage("");
      try {
         await deleteReview(review.id);
         onClose();
         onSuccess?.();
      } catch (error: unknown) {
         setApiMessage(extractErrorMessage(error, "리뷰 삭제 실패"));
      } finally {
         setDeleteLoading(false);
      }
   };

   const rating = watch("rating") ?? 0;
   const content = watch("content") ?? "";
   const isActive = rating > 0 && content.length >= 10;

   if (!isOpen) return null;

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <InputModal
            isOpen={isOpen}
            onClose={() => {
               onClose();
               reset();
               setApiMessage("");
            }}
            title="리뷰 수정/삭제"
            buttonTitle={isSubmitting ? "수정 중..." : "수정 완료"}
            isActive={isActive && !isSubmitting}
         >
            <ReviewFormBody
               estimate={review}
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
            />
            {apiMessage && (
               <div className="mb-2 text-red-600">{apiMessage}</div>
            )}
            <SolidButton
               type="button"
               className="mt-2 w-full bg-red-500"
               disabled={isSubmitting || deleteLoading}
               onClick={handleDelete}
            >
               {deleteLoading ? "삭제 중..." : "리뷰 삭제"}
            </SolidButton>
         </InputModal>
      </form>
   );
}
