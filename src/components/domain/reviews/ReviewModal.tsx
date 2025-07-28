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
import { extractErrorMessage } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useValidationSchema } from "@/lib/hooks/useValidationSchema";

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
   const t = useTranslations("Reviews");

   const { createSchema } = useValidationSchema();

   const {
      handleSubmit,
      setValue,
      register,
      reset,
      watch,
      formState: { errors, isSubmitting },
   } = useForm<CreateReviewDto>({
      resolver: zodResolver(createSchema),
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
      } catch (error: unknown) {
         setApiMessage(extractErrorMessage(error, t("reviewError")));
      }
   };

   const rating = watch("rating") ?? 0;
   const content = watch("content") ?? "";

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
            title={t("modalTitle")}
            buttonTitle={isSubmitting ? t("registering") : t("registerReview")}
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
