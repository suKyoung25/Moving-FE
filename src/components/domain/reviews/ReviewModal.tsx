"use client";

import React, { useEffect, useState } from "react";
import { ReviewFormBody } from "./ReviewFormBody";
import { WritableReview } from "@/lib/types";
import InputModal from "@/components/common/InputModal";
import { useForm } from "react-hook-form";
import {
   CreateReviewDto,
   createReviewSchema,
} from "@/lib/schemas/reviews.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReview } from "@/lib/api/review/createReview";

interface ReviewModalProps {
   isOpen: boolean;
   onClose: () => void;
   selectedEstimate?: WritableReview;
   onReviewSuccess?: () => void;
}

export default function ReviewModal({
   isOpen,
   onClose,
   selectedEstimate,
   onReviewSuccess,
}: ReviewModalProps) {
   const {
      handleSubmit,
      setValue,
      register,
      reset,
      watch,
      formState: { errors, isSubmitting },
   } = useForm<CreateReviewDto>({
      resolver: zodResolver(createReviewSchema),
      defaultValues: {
         rating: 0,
         content: "",
         estimateId: selectedEstimate?.estimateId ?? "",
      },
   });

   const [apiMessage, setApiMessage] = useState("");
   // 별점 호버링
   const [hovered, setHovered] = useState<number | null>(null);

   useEffect(() => {
      if (isOpen && selectedEstimate) {
         reset({
            rating: 0,
            content: "",
            estimateId: selectedEstimate.estimateId,
         });
         setHovered(null);
         setApiMessage("");
      }
   }, [isOpen, selectedEstimate, reset]);

   const handleSuccess = () => {
      onClose();
      reset();
      setHovered(null);
      onReviewSuccess?.();
   };

   const onSubmit = async (data: CreateReviewDto) => {
      setApiMessage("");
      try {
         await createReview(data);
         handleSuccess();
      } catch (error: any) {
         setApiMessage(
            error?.body?.message ||
               error?.message ||
               "리뷰 등록 중 오류가 발생했습니다.",
         );
      }
   };

   const rating = watch("rating");
   const content = watch("content");

   if (!isOpen || !selectedEstimate) return null;

   // 버튼 활성화
   const isActive = rating > 0 && content.trim().length >= 10;

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <input
            type="hidden"
            {...register("estimateId")}
            value={selectedEstimate.estimateId}
            readOnly
         />
         <input hidden name="rating" value={rating} readOnly />
         <input hidden name="content" value={content} readOnly />
         <InputModal
            isOpen={isOpen}
            onClose={() => {
               onClose();
               reset();
               setHovered(null);
               setApiMessage("");
            }}
            title="리뷰 쓰기"
            buttonTitle={isSubmitting ? "등록 중..." : "리뷰 등록"}
            isActive={isActive && !isSubmitting}
         >
            <ReviewFormBody
               estimate={selectedEstimate}
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
               <p className="mt-2 text-sm text-red-500">{apiMessage}</p>
            )}
         </InputModal>
      </form>
   );
}
