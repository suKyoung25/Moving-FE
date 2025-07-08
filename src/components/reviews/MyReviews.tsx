"use client";

import React from "react";
import { estimateMocks } from "./estimateMock";
import Image from "next/image";
import MoveChip from "@/components/common/chips/MoveChip";
import profile from "@/assets/images/profileUploaderIcon.svg";
import yellowStar from "@/assets/images/starFilledIcon.svg";
import grayStar from "@/assets/images/starOutlineIcon.svg";
import blueFolder from "@/assets/images/emptyBlueFolderIcon.svg";
import SolidButton from "@/components/common/buttons/SolidButton";
import { isChipType } from "@/lib/types";
import { formatIsoToYMD } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function MyReviews() {
  const reviewsOnly = estimateMocks.filter((item) => item.review);
  const router = useRouter();

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 lg:mb-6">
        {reviewsOnly.map((estimate) => (
          <div
            key={estimate.id}
            className="relative w-full h-54.5 lg:h-86.5 rounded-2xl bg-white border border-line-100 pt-5 pb-3.5 px-3.5 md:px-4 lg:py-8 lg:px-6 md:mb-2 lg:mb-6 shadow-[2px_2px_10px_0px_rgba(220,220,220,0.10),_-2px_-2px_10px_0px_rgba(220,220,220,0.10)]"
          >
            <div className="mb-3.5 flex gap-2 lg:gap-3">
              {isChipType(estimate.moveType) ? (
                <MoveChip type={estimate.moveType} />
              ) : null}
              {estimate.isDesignated && <MoveChip type={"DESIGNATED"} />}
            </div>
            <div className="absolute bottom-2.5 right-3.5 lg:top-9 lg:right-9 text-12-regular lg:text-18-regular text-gray-300 gap-1.5 lg:gap-2">
              <span>작성일</span>
              <span>{formatIsoToYMD(estimate.review?.createdAt || "")}</span>
            </div>
            <div className="flex items-center bg-white rounded-md pb-2.5 border-b-1 lg:border border-line-100 md:px-2 lg:px-4.5 lg:py-6 w-full  shadow-[4px_4px_16px_0px_rgba(233,233,233,0.10)] mb-3.5 lg:mb-8">
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
                <div className="flex items-center mt-1.5 lg:mt-2 text-13-medium lg:text-16-medium text-gray-300">
                  <span className="flex items-center gap-1.5 lg:gap-3">
                    <span>이사일</span>
                    <span className=" text-black-300 ">
                      {formatIsoToYMD(estimate.moveDate)}
                    </span>
                  </span>
                  <span className="h-3 w-px bg-line-200 mx-2.5 lg:mx-4 "></span>
                  <span className="flex items-center gap-0.5 lg:gap-1">
                    <span>견적가</span>
                    <span className=" text-black-300">
                      {estimate.price.toLocaleString()}원
                    </span>
                  </span>
                </div>
                <div className="hidden lg:mt-4 lg:flex items-center">
                  {Array(estimate.review?.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Image
                        key={i}
                        src={yellowStar}
                        width={24}
                        height={24}
                        alt="별점"
                      />
                    ))}
                  {Array(5 - Number(estimate.review?.rating))
                    .fill(0)
                    .map((_, i) => (
                      <Image
                        key={i}
                        src={grayStar}
                        width={24}
                        height={24}
                        alt="별점"
                      />
                    ))}
                </div>
              </div>
            </div>
            <div className="h-12 lg:h-16 text-14-regular lg:text-20-regular text-gray-500 line-clamp-2">
              {estimate.review?.content}
            </div>
          </div>
        ))}
      </div>
      {reviewsOnly.length === 0 && (
        <div className="flex flex-col justify-center items-center mt-46">
          <Image
            src={blueFolder}
            width={184}
            height={136}
            alt="빈 화면"
            className="w-27.5 h-20.5 lg:w-46 lg:h-34"
          />
          <div className="my-6 lg:my-8 text-16-regular lg:text-24-regular text-gray-400">
            아직 등록한 리뷰가 없어요!
          </div>
          <SolidButton
            className="max-w-45"
            onClick={() => router.replace("?tab=writable")}
          >
            리뷰 작성하러 가기
          </SolidButton>
        </div>
      )}
    </div>
  );
}
