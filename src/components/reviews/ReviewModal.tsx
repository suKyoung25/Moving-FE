'use state'

import React, { useState } from "react";
import InputModal from "../common/modals/InputModal";
import { ReviewFormBody } from "./ReviewFormBody";

interface Estimate {
  id: number;
  moveType: string;
  isDesignated: boolean;
  profileImage: string;
  nickName: string;
  moveDate: string;
  price: number;
};

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEstimate?: Estimate | null;
};

export default function ReviewModal({
  isOpen,
  onClose,
  selectedEstimate,
}: ReviewModalProps) {
  // 별점
  const [rating, setRating] = useState(0);
  // 별점 호버링
  const [hovered, setHovered] = useState<number | null>(null);
  // 리뷰 내용
  const [content, setContent] = useState("");

  // 버튼 활성화
  const isActive = rating > 0 && content.trim().length >= 10;

  // 등록 버튼
  const handleRegister = () => {
    // 등록 로직
    onClose();
    setRating(0);
    setHovered(null);
    setContent("");
  };

  // 닫기 버튼
  const handleClose = () => {
    onClose();
    setRating(0);
    setHovered(null);
    setContent("");
  }

  if (!isOpen || !selectedEstimate) return null;

  return (
    <InputModal
      isOpen={isOpen}
      onClose={handleClose}
      onClick={handleRegister}
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
    </InputModal>
  );
}
