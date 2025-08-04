"use client";

import React, { useEffect, useState } from "react";
import { ReviewFormBody } from "./ReviewFormBody";
import { WritableReview } from "@/lib/types";
import InputModal from "@/components/common/InputModal";
import { useForm } from "react-hook-form";
import { CreateReviewDto } from "@/lib/schemas/reviews.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractErrorMessage } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useValidationSchema } from "@/lib/hooks/useValidationSchema";
import { useCreateReview } from "@/lib/api/review/mutation";

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
      formState: { errors },
   } = useForm<CreateReviewDto>({
      resolver: zodResolver(createSchema),
      defaultValues: {
         rating: 0,
         content: "",
         estimateId: selectedEstimate?.estimateId ?? "",
      },
   });

   const [apiMessage, setApiMessage] = useState("");
   const [hovered, setHovered] = useState<number | null>(null);

   // mutation 사용
   const mutation = useCreateReview({
      onSuccess: () => {
         onClose();
         reset();
         setHovered(null);
         setApiMessage("");
         onReviewSuccess?.();
      },
      onError: (error: unknown) => {
         setApiMessage(extractErrorMessage(error, t("reviewError")));
      },
   });

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

   const rating = watch("rating") ?? 0;
   const content = watch("content") ?? "";

   if (!isOpen || !selectedEstimate) return null;

   // 버튼 활성화 여부
   const isActive = rating > 0 && content.trim().length >= 10;

   const onSubmit = (data: CreateReviewDto) => {
      setApiMessage("");
      mutation.mutate(data);
   };

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
            buttonTitle={
               mutation.isPending ? t("registering") : t("registerReview")
            }
            isActive={isActive && !mutation.isPending}
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
