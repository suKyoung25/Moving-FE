"use client";

import React, { useEffect, useState } from "react";
import { ReviewFormBody } from "./ReviewFormBody";
import { WritableReview, MyReview } from "@/lib/types";
import InputModal from "@/components/common/InputModal";
import { useForm } from "react-hook-form";
import { UpdateReviewDto } from "@/lib/schemas/reviews.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractErrorMessage } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useValidationSchema } from "@/lib/hooks/useValidationSchema";
import { useUpdateReview, useDeleteReview } from "@/lib/api/review/mutation";
import SolidButton from "@/components/common/SolidButton";

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
   const { updateSchema } = useValidationSchema();

   const {
      handleSubmit,
      setValue,
      reset,
      formState: { errors },
      watch,
   } = useForm<UpdateReviewDto>({
      resolver: zodResolver(updateSchema),
      defaultValues: {
         rating: review.rating,
         content: review.content,
      },
   });

   const [apiMessage, setApiMessage] = useState("");
   const [hovered, setHovered] = useState<number | null>(null);

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
         reset({ rating: review.rating, content: review.content });
         setApiMessage("");
         setHovered(null);
      }
   }, [isOpen, review, reset]);

   const rating = watch("rating") ?? 0;
   const content = watch("content") ?? "";
   const isActive = rating > 0 && content.length >= 10;

   if (!isOpen) return null;

   const onSubmit = (data: UpdateReviewDto) => {
      setApiMessage("");
      updateMutation.mutate({ id: review.id, data });
   };

   const handleDelete = () => {
      if (!window.confirm(t("deleteConfirm"))) return;
      setApiMessage("");
      deleteMutation.mutate(review.id);
   };

   const loading = updateMutation.isPending || deleteMutation.isPending;

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <InputModal
            isOpen={isOpen}
            onClose={() => {
               onClose();
               reset();
               setApiMessage("");
               setHovered(null);
            }}
            title={t("editDelete")}
            buttonTitle={
               loading
                  ? updateMutation.isPending
                     ? t("editting")
                     : t("deleting")
                  : t("editReview")
            }
            isActive={isActive && !loading}
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
            />
            {apiMessage && (
               <div className="mb-2 text-red-600">{apiMessage}</div>
            )}
            <SolidButton
               type="button"
               className="mt-2 w-full bg-red-500"
               disabled={loading}
               onClick={handleDelete}
            >
               {deleteMutation.isPending ? t("deleting") : t("deleteReview")}
            </SolidButton>
         </InputModal>
      </form>
   );
}
