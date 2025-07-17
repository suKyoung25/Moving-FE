"use client";

import React, { useActionState, useEffect, useState } from "react";
import InputModal from "../common/modals/InputModal";
import { ReviewFormBody } from "./ReviewFormBody";
import { ReviewFormState, WritableReview } from "@/lib/types";
import { createReviewAction } from "@/lib/actions/reviews/create-review.action";

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
   // 별점
   const [rating, setRating] = useState(0);
   // 별점 호버링
   const [hovered, setHovered] = useState<number | null>(null);
   // 리뷰 내용
   const [content, setContent] = useState("");

   // 버튼 활성화
   const isActive = rating > 0 && content.trim().length >= 10;

   const createReviewInitialState: ReviewFormState = {
      success: false,
      message: "",
   };

   const [state, formAction] = useActionState(
      createReviewAction,
      createReviewInitialState,
   );

   const resetState = () => {
      setRating(0);
      setHovered(null);
      setContent("");
   };

   useEffect(() => {
      if (state.success) {
         onClose();
         resetState();
         onReviewSuccess?.();
      }
   }, [state.success, onClose, onReviewSuccess]);

   if (!isOpen || !selectedEstimate) return null;

   return (
      <form action={formAction}>
         <input
            hidden
            name="estimateId"
            value={selectedEstimate.estimateId}
            readOnly
         />
         <input hidden name="rating" value={rating} readOnly />
         <input hidden name="content" value={content} readOnly />
         <InputModal
            isOpen={isOpen}
            onClose={() => {
               onClose();
               resetState();
            }}
            title="리뷰 쓰기"
            buttonTitle="리뷰 등록"
            isActive={isActive}
         >
            <ReviewFormBody
               estimate={selectedEstimate}
               rating={rating}
               setRating={setRating}
               hovered={hovered}
               setHovered={setHovered}
               content={content}
               setContent={setContent}
            />
            {!state.success && state.message && (
               <p className="mt-2 text-sm text-red-500">{state.message}</p>
            )}
         </InputModal>
      </form>
   );
}
