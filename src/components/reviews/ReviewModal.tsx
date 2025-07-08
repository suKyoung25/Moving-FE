import Image from "next/image";
import React, { useState } from "react";
import close from "@/assets/images/xIcon.svg";
import MoveChip from "@/components/common/chips/MoveChip";
import profile from "@/assets/images/profileUploaderIcon.svg";
import yellowStar from "@/assets/images/starFilledIcon.svg";
import grayStar from "@/assets/images/starOutlineIcon.svg";
import SolidButton from "@/components/common/buttons/SolidButton";
import { isChipType } from "@/lib/types";
import { formatIsoToYMD } from "@/lib/utils";

type Estimate = {
  id: number;
  moveType: string;
  isDesignated: boolean;
  profileImage: string;
  nickName: string;
  moveDate: string;
  price: number;
};

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedEstimate?: Estimate | null;
};

export default function ReviewModal({
  isOpen,
  onClose,
  selectedEstimate,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [content, setContent] = useState("");

  if (!isOpen || !selectedEstimate) return null;

  const isActive = rating > 0 && content.trim().length >= 10;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-t-2xl md:rounded-2xl shadow-lg md:max-w-94 lg:max-w-152 w-full py-8 px-6 max-h-167 lg:max-h-213.5 h-full">
        <div className="text-18-bold lg:text-24-semibold mb-6.5 lg:mb-10">
          리뷰 쓰기
        </div>
        <button
          onClick={() => {
            onClose();
            setContent("");
            setRating(0);
          }}
          className="absolute top-7.5 right-6 w-6 h-6 lg:w-9 lg:h-9"
        >
          <Image src={close} fill alt="닫기" />
        </button>
        {/* 카드 내용 */}
        <div className="mb-3.5 flex gap-2 lg:gap-3">
          {isChipType(selectedEstimate.moveType) ? (
            <MoveChip type={selectedEstimate.moveType} />
          ) : null}
          {selectedEstimate.isDesignated && <MoveChip type={"DESIGNATED"} />}
        </div>
        <div className="flex items-center bg-white rounded-md lg:border border-line-100 md:px-2 lg:px-4.5 lg:py-6 w-full shadow-[4px_4px_16px_0px_rgba(233,233,233,0.10)] mb-3.5 lg:mb-8">
          <div className="relative rounded-full overflow-hidden mr-3 lg:mr-6 w-11.5 h-11.5 lg:w-24 lg:h-24 border-2 border-primary-blue-400">
            <Image
              src={selectedEstimate.profileImage || profile}
              alt="프로필"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-14-semibold lg:text-18-semibold text-black-300">
                {selectedEstimate.nickName} 기사님
              </span>
            </div>
            <div className="flex items-center mt-3 lg:mt-4 text-13-medium lg:text-16-medium text-gray-300">
              <span className="flex items-center gap-1.5 lg:gap-3">
                <span className="bg-bg-400 px-1 py-0.5 lg:px-1.5 lg:py-1 rounded-sm">
                  이사일
                </span>
                <span className=" text-black-300 ">
                  {formatIsoToYMD(selectedEstimate.moveDate)}
                </span>
              </span>
              <span className="h-3 w-px bg-line-200 mx-2.5 lg:mx-4 "></span>
              <span className="flex items-center gap-1.5 lg:gap-3">
                <span className="bg-bg-400 px-1 py-0.5 lg:px-1.5 lg:py-1 rounded-sm">
                  견적가
                </span>
                <span className=" text-black-300">
                  {selectedEstimate.price.toLocaleString()}원
                </span>
              </span>
            </div>
          </div>
        </div>
        <hr className="w-full h-px bg-line-100 border-0 my-5 lg:hidden" />
        <div>
          <span className="text-16-semibold lg:text-20-semibold">
            평점을 선택해 주세요
          </span>
          <div className="flex gap-1 mt-4 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(null)}
                className="focus:outline-none"
                aria-label={`${star}점`}
              >
                <Image
                  src={star <= (hovered ?? rating) ? yellowStar : grayStar}
                  alt={star <= (hovered ?? rating) ? "노란별" : "회색별"}
                  width={48}
                  height={48}
                  className="w-6 h-6 lg:w-12 lg:h-12"
                />
              </button>
            ))}
          </div>
          <hr className="w-full h-px bg-line-100 border-0 my-5 lg:my-8" />
        </div>
        <div>
          <div className="text-16-semibold lg:text-20-semibold mb-4">
            상세 후기를 작성해 주세요
          </div>
          <textarea
            className="bg-bg-200 h-40 rounded-2xl w-full px-4 py-3.5 resize-none mb-6.5 lg:mb-10"
            placeholder="최소 10자 이상 입력해 주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <SolidButton disabled={!isActive}>리뷰 등록</SolidButton>
      </div>
    </div>
  );
}
