"use client";

import React, { useEffect, useRef, useState } from "react";
import { ReviewFormBody } from "./ReviewFormBody";
import { WritableReview } from "@/lib/types";
import InputModal from "@/components/common/InputModal";
import { useForm } from "react-hook-form";
import {
   CreateReviewDto,
   useReviewSchemas,
} from "@/lib/schemas/reviews.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractErrorMessage } from "@/lib/utils";
import { useTranslations } from "next-intl";
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
   const { createReviewSchema } = useReviewSchemas();

   const firstInputRef = useRef<HTMLInputElement>(null); // 포커스 관리용
   const prevActiveElement = useRef<HTMLElement | null>(null); // 포커스 복원용

   const {
      handleSubmit,
      setValue,
      register,
      reset,
      watch,
      formState: { errors },
   } = useForm<CreateReviewDto>({
      resolver: zodResolver(createReviewSchema),
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
         // 모달 오픈 시 한 번만 실행
         prevActiveElement.current = document.activeElement as HTMLElement;
         reset({
            rating: 0,
            content: "",
            estimateId: selectedEstimate.estimateId,
         });
         setHovered(null);
         setApiMessage("");
         //  포커스 첫 입력으로 이동
         setTimeout(() => {
            firstInputRef.current?.focus();
         }, 0);
      }
      if (!isOpen && prevActiveElement.current) {
         prevActiveElement.current.focus(); // 모달 닫으면 포커스 복원
      }
   }, [isOpen, selectedEstimate, reset]);

   // ESC로 닫기
   useEffect(() => {
      if (!isOpen) return;
      const onKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            onClose();
            reset();
            setHovered(null);
            setApiMessage("");
         }
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
   }, [isOpen, onClose, reset]);

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
      <form
         onSubmit={handleSubmit(onSubmit)}
         aria-labelledby="review-modal-title"
      >
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
               <p className="mt-2 text-sm text-red-500" role="alert">
                  {apiMessage}
               </p>
            )}
         </InputModal>
      </form>
   );
}
