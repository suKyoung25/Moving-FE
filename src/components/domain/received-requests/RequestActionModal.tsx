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
   requestActionFormSchema,
   RequestActionFormSchema,
} from "@/lib/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { receivedRequestsQueryKey } from "@/lib/api/request/query";

interface Props {
   isOpen: boolean;
   onClose: () => void;
   modalType: "accept" | "reject";
   setToast: (
      toast: { id: number; text: string; success: boolean } | null,
   ) => void;

   request: ReceivedRequest;
   requestId: string;
   clientId: string;
}

export default function RequestActionModal({
   isOpen,
   onClose,
   modalType,
   setToast,
   request,
   requestId,
   clientId,
}: Props) {
   const queryClient = useQueryClient();

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
         setToast({
            id: Date.now(),
            text:
               modalType === "accept"
                  ? "고객님께 견적을 성공적으로 발송했습니다."
                  : "견적 요청을 반려 처리했습니다.",
            success: true,
         });
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
            title={modalType === "accept" ? "견적 보내기" : "요청 반려"}
            buttonTitle={modalType === "accept" ? "견적 보내기" : "반려하기"}
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
                  {request.clientName} 고객님
               </span>
               <div className="flex items-center gap-2 lg:gap-2.5">
                  <MoveTextCard text="이사일" />
                  <span className="text-14-medium lg:text-20-medium">
                     {request.moveDate.slice(0, 10)} (
                     {"일월화수목금토"[new Date(request.moveDate).getDay()]})
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
                        견적 금액
                     </label>
                     <input
                        type="text"
                        inputMode="numeric"
                        placeholder="금액을 입력하세요"
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
                        ? "코멘트를 입력해 주세요"
                        : "반려 사유"}
                  </label>
                  <textarea
                     className="bg-bg-200 w-full rounded-2xl p-3.5"
                     placeholder={
                        modalType === "accept"
                           ? "견적에 대한 메모를 입력해주세요."
                           : "반려 사유를 입력해주세요."
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
