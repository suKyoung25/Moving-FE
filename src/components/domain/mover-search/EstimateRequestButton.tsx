"use client";

import { useState, useEffect } from "react";
import { NoRequestModal } from "./NoRequestModal";
import { createDesignatedEstimate } from "@/lib/api/estimate/requests/createDesignatedEstimate";
import { Mover } from "@/lib/types";
import ToastPopup from "@/components/common/ToastPopup";
import { useAuth } from "@/context/AuthContext";
import { useActiveRequest } from "@/lib/api/request/requests/query";

interface EstimateRequestButtonProps {
   moverId: string;
   mover: Mover;
   onDesignatedEstimateSuccess?: (moverId: string) => void;
   setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
   setIsResultModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EstimateRequestButton({
   moverId,
   mover,
   onDesignatedEstimateSuccess,
   setErrorMessage,
   setIsResultModalOpen,
}: EstimateRequestButtonProps) {
   const { user } = useAuth();
   const [isLoading, setIsLoading] = useState(false);
   const [showNoRequestModal, setShowNoRequestModal] = useState(false);
   const [isRequestSuccess, setIsRequestSuccess] = useState(
      mover.hasDesignatedRequest ?? false,
   );
   const [toast, setToast] = useState<{
      id: number;
      text: string;
      success: boolean;
   } | null>(null);

   const { data: result, isPending } = useActiveRequest();
   const activeRequest = result?.data;

   // mover 상태가 변경되면 버튼 상태도 업데이트
   useEffect(() => {
      setIsRequestSuccess(mover.hasDesignatedRequest ?? false);
   }, [mover.hasDesignatedRequest]);

   const handleClick = async () => {
      if (!user) {
         setErrorMessage("로그인이 필요한 기능입니다.");
         setIsResultModalOpen(true);
         return;
      }
      //  이미 성공한 경우 클릭 막기
      if (isRequestSuccess) return;

      try {
         setIsLoading(true);
         if (isPending) return;

         if (!activeRequest) {
            setShowNoRequestModal(true);
            return;
         } else if (!activeRequest.isPending) {
            setToast({
               id: Date.now(),
               text: "이미 진행중인 견적이 있어요!",
               success: false,
            });
            return;
         }
         await submitDesignatedEstimate(activeRequest.id);
      } catch (error) {
         console.error("활성 요청 조회 실패:", error);

         let errorMessage = "요청 조회에 실패했습니다.";
         if (error instanceof Error) {
            if (error.message.includes("로그인")) {
               errorMessage = "로그인이 필요합니다. 다시 로그인해주세요.";
            } else {
               errorMessage = error.message;
            }
         }

         setToast({
            id: Date.now(),
            text: errorMessage,
            success: false,
         });
      } finally {
         setIsLoading(false);
      }
   };

   const submitDesignatedEstimate = async (requestId: string) => {
      try {
         setIsLoading(true);

         // 이때 DesignatedRequest 테이블에 레코드 생성됨
         await createDesignatedEstimate(moverId, requestId);

         setToast({
            id: Date.now(),
            text: "지정 견적 요청이 성공적으로 전송되었습니다!",
            success: true,
         });

         setIsRequestSuccess(true);

         // 성공 시 부모에게 알림 (DESIGNATED 칩 표시용)
         onDesignatedEstimateSuccess?.(moverId);
      } catch (error) {
         console.error("지정 견적 요청 실패:", error);

         let errorMessage = "지정 견적 요청에 실패했습니다.";
         if (error instanceof Error) {
            const errorText = error.message;

            if (
               errorText.includes("이미 지정 견적을 요청한 기사님입니다") ||
               errorText.includes("Unique constraint failed")
            ) {
               errorMessage = "이미 이 기사님에게 지정 견적을 요청하셨습니다.";
               setIsRequestSuccess(true); // 이미 요청한 경우도 성공 상태로 처리
            } else if (
               errorText.includes("진행 중인 요청을 찾을 수 없습니다")
            ) {
               errorMessage = "요청이 만료되었거나 이미 완료되었습니다.";
            } else if (errorText.includes("기사님을 찾을 수 없습니다")) {
               errorMessage = "기사님 정보를 찾을 수 없습니다.";
            } else if (errorText.includes("로그인")) {
               errorMessage = "로그인이 필요합니다. 다시 로그인해주세요.";
            } else {
               errorMessage = errorText;
            }
         }

         setToast({
            id: Date.now(),
            text: errorMessage,
            success: false,
         });
      } finally {
         setIsLoading(false);
      }
   };

   const handleNoRequestConfirm = () => {
      setShowNoRequestModal(false);
      window.location.href = "/request";
   };

   //  버튼 스타일과 텍스트 결정
   const getButtonStyle = () => {
      if (isRequestSuccess) {
         return "cursor-not-allowed bg-gray-100 text-white";
      }
      if (isLoading) {
         return "cursor-not-allowed bg-gray-400 text-white";
      }
      return "bg-blue-500 hover:bg-blue-600 text-white";
   };

   const getButtonText = () => {
      if (isRequestSuccess) {
         return "지정 견적 요청 완료";
      }
      if (isLoading) {
         return "처리 중...";
      }
      return "지정 견적 요청하기";
   };

   return (
      <>
         <button
            onClick={handleClick}
            disabled={isLoading || isRequestSuccess} //  성공 시에도 비활성화
            className={`w-full rounded-lg px-4 py-3 font-medium transition-colors ${getButtonStyle()}`}
         >
            {getButtonText()}
         </button>

         <NoRequestModal
            isOpen={showNoRequestModal}
            onClose={() => setShowNoRequestModal(false)}
            onConfirm={handleNoRequestConfirm}
         />

         {toast && (
            <ToastPopup
               key={toast.id}
               text={toast.text}
               success={toast.success}
            />
         )}
      </>
   );
}
