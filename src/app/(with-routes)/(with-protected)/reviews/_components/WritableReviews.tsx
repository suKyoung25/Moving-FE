"use client";

import React, { useState } from "react";
import { estimateMocks } from "./estimateMock";
import MoveChip from "@/components/common/chips/MoveChip";
import { isChipType } from "@/types";
import Image from "next/image";
import profile from "@/assets/images/profileUploaderIcon.svg";
import { formatIsoToYMD } from "@/utils";
import SolidButton from "@/components/common/buttons/SolidButton";
import ReviewModal from "./ReviewModal";
import blueFolder from "@/assets/images/emptyBlueFolderIcon.svg";

export default function WritableReviews() {
  const noReview = estimateMocks.filter((item) => !item.review);

  // 선택된 estimate의 id를 저장
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // id로 해당 estimate 객체 찾기
  const selectedEstimate = noReview.find((item) => item.id === selectedId);

  const handleReviewModal = (id: number | null) => {
    setSelectedId(id);
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 lg:mb-6">
        {noReview.map((estimate) => (
          <div
            key={estimate.id}
            className="w-full h-52 lg:h-86.5 rounded-2xl bg-white border border-line-100 pt-5 pb-3.5 px-3.5 md:px-4 lg:py-8 lg:px-6 md:mb-2 lg:mb-6 shadow-[2px_2px_10px_0px_rgba(220,220,220,0.10),_-2px_-2px_10px_0px_rgba(220,220,220,0.10)]"
          >
            <div className="mb-3.5 flex gap-2 lg:gap-3">
              {isChipType(estimate.moveType) ? (
                <MoveChip type={estimate.moveType} />
              ) : null}
              {estimate.isDesignated && <MoveChip type={"DESIGNATED"} />}
            </div>
            <div className="flex items-center bg-white rounded-md lg:border border-line-100 md:px-2 lg:px-4.5 lg:py-6 w-full  shadow-[4px_4px_16px_0px_rgba(233,233,233,0.10)] mb-3.5 lg:mb-8">
              {/* 프로필 이미지 */}
              <div className="relative rounded-full overflow-hidden mr-3 lg:mr-6 w-11.5 h-11.5 lg:w-24 lg:h-24 border-2 border-primary-blue-400">
                <Image
                  src={estimate.profileImage || profile}
                  alt="프로필"
                  fill
                  className="object-cover"
                />
              </div>
              {/* 정보 영역 */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-14-semibold lg:text-18-semibold text-black-300">
                    {estimate.nickName} 기사님
                  </span>
                </div>
                <div className="flex items-center mt-3 lg:mt-4 text-13-medium lg:text-16-medium text-gray-300">
                  <span className="flex items-center gap-1.5 lg:gap-3">
                    <span>이사일</span>
                    <span className=" text-black-300 ">
                      {formatIsoToYMD(estimate.moveDate)}
                    </span>
                  </span>
                  <span className="h-3 w-px bg-line-200 mx-2.5 lg:mx-4 "></span>
                  <span className="flex items-center gap-1.5 lg:gap-3">
                    <span>견적가</span>
                    <span className=" text-black-300">
                      {estimate.price.toLocaleString()}원
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <SolidButton onClick={() => handleReviewModal(estimate.id)}>
              리뷰 작성하기
            </SolidButton>
          </div>
        ))}
      </div>
      {noReview.length === 0 && (
        <div className="flex flex-col justify-center items-center mt-46">
          <Image
            src={blueFolder}
            width={184}
            height={136}
            alt="빈 화면"
            className="w-27.5 h-20.5 lg:w-46 lg:h-34"
          />
          <div className="my-6 lg:my-8 text-16-regular lg:text-24-regular text-gray-400">
            작성 가능한 리뷰가 없어요
          </div>
        </div>
      )}
      <ReviewModal
        isOpen={selectedId !== null}
        onClose={() => setSelectedId(null)}
        selectedEstimate={selectedEstimate}
      />
    </div>
  );
}
