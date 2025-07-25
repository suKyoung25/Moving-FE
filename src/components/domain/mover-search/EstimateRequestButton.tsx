"use client";

import { useState } from "react";
import { getClientActiveRequests } from "@/lib/api/mover/getClientRequest";
import { createDesignatedEstimate } from "@/lib/api/mover/createDesignatedEstimate";
import { NoRequestModal } from "./NoRequestModal";
import { RequestSelectionModal } from "./RequestSelectionModal";

interface Request {
  id: string;
  moveType: 'SMALL' | 'HOME' | 'OFFICE';
  moveDate: string;
  fromAddress: string;
  toAddress: string;
  requestedAt: string;
}

export function EstimateRequestButton({ moverId }: { moverId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showNoRequestModal, setShowNoRequestModal] = useState(false);
  const [activeRequests, setActiveRequests] = useState<Request[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');

  const handleClick = async () => {
    try {
      setIsLoading(true);
      
      // tokenFetch를 사용하므로 token 매개변수 제거
      const response = await getClientActiveRequests();
      setActiveRequests(response.requests);
      
      if (response.requests.length === 0) {
        setShowNoRequestModal(true);
        return;
      }
      
      // 요청이 1개면 바로 선택, 여러 개면 모달 표시
      if (response.requests.length === 1) {
        setSelectedRequestId(response.requests[0].id);
        await submitDesignatedEstimate(response.requests[0].id);
      } else {
        setShowModal(true);
      }
      
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
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const submitDesignatedEstimate = async (requestId: string) => {
    try {
      setIsLoading(true);
      
      await createDesignatedEstimate(moverId, requestId);
      
      alert("지정 견적 요청이 성공적으로 전송되었습니다!");
      setShowModal(false);
      
    } catch (error) {
      console.error("지정 견적 요청 실패:", error);
      
      let errorMessage = "지정 견적 요청에 실패했습니다.";
      if (error instanceof Error) {
        const errorText = error.message;
        
        if (errorText.includes("이미 지정 견적을 요청한 기사님입니다") ||
            errorText.includes("Unique constraint failed")) {
          errorMessage = "이미 이 기사님에게 지정 견적을 요청하셨습니다.";
        } else if (errorText.includes("진행 중인 요청을 찾을 수 없습니다")) {
          errorMessage = "요청이 만료되었거나 이미 완료되었습니다.";
        } else if (errorText.includes("기사님을 찾을 수 없습니다")) {
          errorMessage = "기사님 정보를 찾을 수 없습니다.";
        } else if (errorText.includes("로그인")) {
          errorMessage = "로그인이 필요합니다. 다시 로그인해주세요.";
        } else {
          errorMessage = errorText;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = () => {
    if (!selectedRequestId) {
      alert("요청을 선택해주세요.");
      return;
    }
    
    submitDesignatedEstimate(selectedRequestId);
  };

  const handleNoRequestConfirm = () => {
    setShowNoRequestModal(false);
    // 일반 견적 요청 페이지로 이동
    window.location.href = '/request/create';
    // 또는 Next.js router 사용
    // router.push('/request/create');
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`w-full rounded-lg px-4 py-3 font-medium text-white transition-colors ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? '처리 중...' : '지정 견적 요청하기'}
      </button>

      {/* 이사 요청이 없을 때 모달 */}
      <NoRequestModal
        isOpen={showNoRequestModal}
        onClose={() => setShowNoRequestModal(false)}
        onConfirm={handleNoRequestConfirm}
      />

      {/* 요청 선택 모달 */}
      <RequestSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleModalSubmit}
        requests={activeRequests}
        selectedRequestId={selectedRequestId}
        onSelectRequest={setSelectedRequestId}
        isLoading={isLoading}
      />
    </>
  );
}