"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { sendEstimateRequest } from "@/lib/api/estimate/requests/sendEstimateRequest";
import { rejectEstimateRequest } from "@/lib/api/estimate/requests/rejectEstimateRequest";
import { ReceivedRequest } from "@/lib/types";

interface Props {
   isOpen: boolean;
   onClose: () => void;
   request: ReceivedRequest;
   type: "accept" | "reject" | null;
   requestId: string;
   clientId: string;
}

export default function RequestActionModal({
   isOpen,
   onClose,
   request,
   type,
   requestId,
   clientId,
}: Props) {
   const [price, setPrice] = useState("");
   const [comment, setComment] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();
   const pathname = usePathname();

   if (!isOpen || !request || !type) return null;

   const handleConfirm = async () => {
      setIsSubmitting(true);
      try {
         if (type === "accept") {
            await sendEstimateRequest({
               price: Number(price),
               comment,
               clientId,
               requestId,
            });
         } else {
            await rejectEstimateRequest({
               comment,
               clientId,
               requestId,
            });
         }

         const locale = pathname.split("/")[1];
         const tab = type === "accept" ? "1" : "2";
         router.push(`/${locale}/my-quotes/mover?tab=${tab}`);
      } catch (error) {
         console.error("요청 실패:", error);
         // TODO: 사용자에게 에러 토스트 등 알림 처리
      } finally {
         setIsSubmitting(false);
         onClose();
         setPrice("");
         setComment("");
      }
   };

   return (
      <div className="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center bg-black">
         <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">
               {type === "accept"
                  ? "견적 요청을 진행하시겠습니까?"
                  : "요청을 반려하시겠습니까?"}
            </h2>
            <p className="mb-4 text-sm">
               고객명: {request.clientName} <br />
               이사일: {request.moveDate}
            </p>

            {type === "accept" && (
               <div className="mb-3">
                  <label className="block text-sm font-medium">
                     견적 금액 (원)
                  </label>
                  <input
                     type="number"
                     value={price}
                     onChange={(e) => setPrice(e.target.value)}
                     className="mt-1 w-full rounded border px-3 py-1 text-sm"
                     placeholder="금액을 입력하세요"
                  />
               </div>
            )}

            <div className="mb-4">
               <label className="block text-sm font-medium">
                  {type === "accept" ? "요청 코멘트" : "반려 사유"}
               </label>
               <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-1 text-sm"
                  placeholder={
                     type === "accept"
                        ? "요청에 대한 메시지를 입력하세요"
                        : "반려 사유를 입력하세요"
                  }
               />
            </div>

            <div className="flex justify-end gap-3">
               <button
                  onClick={onClose}
                  className="rounded bg-gray-200 px-4 py-1 text-sm"
                  disabled={isSubmitting}
               >
                  취소
               </button>
               <button
                  onClick={handleConfirm}
                  className="rounded bg-blue-600 px-4 py-1 text-sm text-white"
                  disabled={isSubmitting || (type === "accept" && !price)}
               >
                  확인
               </button>
            </div>
         </div>
      </div>
   );
}
