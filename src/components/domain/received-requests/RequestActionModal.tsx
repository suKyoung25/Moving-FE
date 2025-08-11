"use client";

import InputModal from "@/components/common/InputModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendEstimateRequest } from "@/lib/api/estimate/requests/sendEstimateRequest";
import { rejectEstimateRequest } from "@/lib/api/estimate/requests/rejectEstimateRequest";
import { ReceivedRequest } from "@/lib/types";
import MoveChip, { ChipType } from "@/components/common/MoveChip";
import MoveTextCard from "../my-quotes/MoveTextCard";
import {
   RequestActionFormSchema,
   useRequestActionFormSchema,
} from "@/lib/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { receivedRequestsQueryKey } from "@/lib/api/request/query";
import { useToast } from "@/context/ToastConText";
import { useTranslations } from "next-intl";
import FormattedDateWithDay from "@/components/common/FormattedDateWithDay";

interface Props {
   isOpen: boolean;
   onClose: () => void;
   modalType: "accept" | "reject";
   request: ReceivedRequest;
   requestId: string;
   clientId: string;
}

export default function RequestActionModal({
   isOpen,
   onClose,
   modalType,
   request,
   requestId,
   clientId,
}: Props) {
   const t = useTranslations("ReceivedRequests");

   const queryClient = useQueryClient();
   const { showSuccess } = useToast();
   const { requestActionFormSchema } = useRequestActionFormSchema();

   const {
      register,
      handleSubmit,
      formState: { errors, isValid, isSubmitting },
      setValue,
      reset,
      watch,
   } = useForm<RequestActionFormSchema>({
      resolver: zodResolver(requestActionFormSchema),
      mode: "onChange",
      defaultValues: {
         modalType,
         price: "",
         comment: "",
      },
   });

   const onSubmit = async (data: RequestActionFormSchema) => {
      try {
         if (modalType === "accept") {
            await sendEstimateRequest({
               price: Number(data.price?.replace(/,/g, "")),
               comment: data.comment,
               clientId,
               requestId,
            });
         } else {
            await rejectEstimateRequest({
               comment: data.comment,
               clientId,
               requestId,
            });
         }

         queryClient.invalidateQueries({
            queryKey: [receivedRequestsQueryKey],
         });
      } catch (error) {
         console.error("요청 실패:", error);
      } finally {
         showSuccess(
            modalType === "accept"
               ? t("toast.sendSuccess")
               : t("toast.rejectSuccess"),
         );
         onClose();
         reset();
      }
   };

   const price = watch("price");

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <InputModal
            isOpen={isOpen}
            onClose={() => {
               onClose();
               reset();
            }}
            title={
               modalType === "accept"
                  ? t("modal.sendTitle")
                  : t("modal.rejectTitle")
            }
            buttonTitle={
               modalType === "accept"
                  ? t("modal.sendButton")
                  : t("modal.rejectButton")
            }
            isActive={isValid && !isSubmitting}
         >
            <div className="flex flex-col gap-2 lg:gap-4">
               <div className="flex gap-2 lg:gap-2.5">
                  <MoveChip
                     type={(request.moveType as ChipType) ?? "PENDING"}
                  />
                  {request.isDesignated && <MoveChip type="DESIGNATED" />}
               </div>
               <span className="text-14-semibold lg:text-24-semibold mt-3">
                  {request.clientName} {t("clientHonorific")}
               </span>
               <div className="flex items-center gap-2 lg:gap-2.5">
                  <MoveTextCard text={t("moveDateLabel")} />
                  <span className="text-14-medium lg:text-20-medium">
                     <FormattedDateWithDay dateString={request.moveDate} />
                  </span>
               </div>
            </div>

            <div className="bg-line-100 my-5 h-[1px]"></div>

            <div className="flex flex-col gap-5">
               <input
                  type="hidden"
                  value={modalType}
                  {...register("modalType")}
               />

               {modalType === "accept" && (
                  <div className="flex flex-col gap-3">
                     <label className="text-16-semibold lg:text-20-semibold">
                        {t("priceLabel")}
                     </label>
                     <input
                        type="text"
                        inputMode="numeric"
                        placeholder={t("pricePlaceholder")}
                        className="bg-bg-200 w-full rounded-2xl p-3.5"
                        value={price ?? ""}
                        onChange={(e) => {
                           const raw = e.target.value.replace(/[^0-9]/g, "");
                           if (raw.length > 10) return;
                           const formatted = Number(raw).toLocaleString();
                           setValue("price", formatted, {
                              shouldValidate: true,
                           });
                        }}
                     />
                     {errors.price && (
                        <span className="text-14-medium lg:text-16-medium text-secondary-red-200">
                           {errors.price.message}
                        </span>
                     )}
                  </div>
               )}

               <div className="flex flex-col gap-3">
                  <label className="text-16-semibold lg:text-20-semibold">
                     {modalType === "accept"
                        ? t("commentLabel")
                        : t("rejectReasonLabel")}
                  </label>
                  <textarea
                     className="bg-bg-200 w-full rounded-2xl p-3.5"
                     placeholder={
                        modalType === "accept"
                           ? t("commentPlaceholder")
                           : t("rejectReasonPlaceholder")
                     }
                     rows={5}
                     {...register("comment")}
                  />
                  {errors.comment && (
                     <span className="text-14-medium lg:text-16-medium text-secondary-red-200">
                        {errors.comment.message}
                     </span>
                  )}
               </div>
            </div>
         </InputModal>
      </form>
   );
}
