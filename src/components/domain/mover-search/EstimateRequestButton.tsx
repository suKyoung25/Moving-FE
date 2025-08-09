"use client";

import { useState, useEffect } from "react";
import { NoRequestModal } from "./NoRequestModal";
import { createDesignatedEstimate } from "@/lib/api/estimate/requests/createDesignatedEstimate";
import { Mover } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useActiveRequest } from "@/lib/api/request/requests/query";
import { useTranslations } from "next-intl";
import { useToast } from "@/context/ToastConText";

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
   const t = useTranslations("MoverDetail");

   const { user } = useAuth();
   const { showSuccess, showError } = useToast();
   const [isLoading, setIsLoading] = useState(false);
   const [showNoRequestModal, setShowNoRequestModal] = useState(false);
   const [isRequestSuccess, setIsRequestSuccess] = useState(
      mover.hasDesignatedRequest ?? false,
   );

   const { data: result, isPending } = useActiveRequest();
   const activeRequest = result?.data;

   // mover 상태가 변경되면 버튼 상태도 업데이트
   useEffect(() => {
      setIsRequestSuccess(mover.hasDesignatedRequest ?? false);
   }, [mover.hasDesignatedRequest]);

   const handleClick = async () => {
      if (!user) {
         setErrorMessage(t("error.loginRequired"));
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
            showError(t("toast.alreadyInProgress"));
            return;
         }
         await submitDesignatedEstimate(activeRequest.id);
      } catch (error) {
         console.error("활성 요청 조회 실패:", error);

         let errorMessage = t("error.requestFailed");
         if (error instanceof Error) {
            if (error.message.includes("로그인")) {
               errorMessage = t("error.loginRequiredAgain");
            } else {
               errorMessage = error.message;
            }
         }
         showError(errorMessage);
      } finally {
         setIsLoading(false);
      }
   };

   const submitDesignatedEstimate = async (requestId: string) => {
      try {
         setIsLoading(true);

         // 이때 DesignatedRequest 테이블에 레코드 생성됨
         await createDesignatedEstimate(moverId, requestId);
         showSuccess(t("toast.requestSuccess"));
         setIsRequestSuccess(true);

         // 성공 시 부모에게 알림 (DESIGNATED 칩 표시용)
         onDesignatedEstimateSuccess?.(moverId);
      } catch (error) {
         console.error("지정 견적 요청 실패:", error);

         let errorMessage = t("error.designatedRequestFailed");
         if (error instanceof Error) {
            const errorText = error.message;

            if (
               errorText.includes("이미 지정 견적을 요청한 기사님입니다") ||
               errorText.includes("Unique constraint failed")
            ) {
               errorMessage = t("error.alreadyRequested");
               setIsRequestSuccess(true); // 이미 요청한 경우도 성공 상태로 처리
            } else if (
               errorText.includes("진행 중인 요청을 찾을 수 없습니다")
            ) {
               errorMessage = t("error.requestExpiredOrCompleted");
            } else if (errorText.includes("기사님을 찾을 수 없습니다")) {
               errorMessage = t("error.noMoverInfo");
            } else if (errorText.includes("로그인")) {
               errorMessage = t("error.loginRequiredAgain");
            } else {
               errorMessage = errorText;
            }
         }

         showError(errorMessage);
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
         return t("button.requestCompleted");
      }
      if (isLoading) {
         return t("button.processing");
      }
      return t("button.requestEstimate");
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
      </>
   );
}
