import InputModal from "@/components/common/InputModal";
import SolidButton from "@/components/common/SolidButton";
import { deleteReview } from "@/lib/api/review/deleteReview";
import { updateReview } from "@/lib/api/review/updateReview";
import { UpdateReviewDto } from "@/lib/schemas/reviews.schema";
import { MyReview } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ReviewFormBody } from "./ReviewFormBody";
import { extractErrorMessage } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useValidationSchema } from "@/lib/hooks/useValidationSchema";

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
      formState: { errors, isSubmitting },
      watch,
   } = useForm<UpdateReviewDto>({
      resolver: zodResolver(updateSchema),
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
         setApiMessage(extractErrorMessage(error, t("editError")));
      }
   };

   //삭제
   const handleDelete = async () => {
      if (!window.confirm(t("deleteConfirm"))) return;
      setDeleteLoading(true);
      setApiMessage("");
      try {
         await deleteReview(review.id);
         onClose();
         onSuccess?.();
      } catch (error: unknown) {
         setApiMessage(extractErrorMessage(error, t("deleteError")));
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
            title={t("editDelete")}
            buttonTitle={isSubmitting ? t("editting") : t("editReview")}
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
               {deleteLoading ? t("deleting") : t("deleteReview")}
            </SolidButton>
         </InputModal>
      </form>
   );
}
