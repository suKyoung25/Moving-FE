"use client";

import React from "react";
import MoveChip from "@/components/common/chips/MoveChip";
import MoverProfile from "@/components/common/profile/MoverProfile";

import profile from "@/assets/images/profileIcon.svg";
import MoveDateCard from "../common/MoveDateCard";
import SolidButton from "@/components/common/buttons/SolidButton";
import OutlinedButton from "@/components/common/buttons/OutlinedButton";
import { useRouter } from "next/navigation";

// 대기중인 견적
export default function Pending() {
  const router = useRouter();
  return (
    <div className="text-black-300 flex flex-col gap-6 md:gap-8 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-10.5">
      <section
        style={{
          boxShadow:
            "-2px -2px 10px rgba(220, 220, 220, 0.2), 2px 2px 10px rgba(220, 220, 220, 0.2)",
        }}
        className="bg-white px-3 lg:px-6 pt-5 lg:pt-7 pb-3.5 lg:pb-5.5 w-full lg:w-172 mx-auto lg:mx-0 flex flex-col gap-2 rounded-2xl"
      >
        <div className="flex flex-col gap-3.5">
          <article className="flex items-center gap-2">
            <MoveChip type="PENDING" />
            <MoveChip type="SMALL" />
            <MoveChip type="DESIGNATED" />
          </article>
          <MoverProfile
            nickName="이삿짐킹"
            profileImage={profile}
            isLiked={false}
            handleLikedClick={() => console.log("찜 토글")}
            favoriteCount={24}
            averageReviewRating={4.8}
            reviewCount={37}
            career={7}
            estimateCount={120}
          />
          <MoveDateCard category="이사일" text="2024.08.01(목)" />
          <article className="flex items-center gap-3.5">
            <MoveDateCard category="출발" text="인천시 남동구" />
            <div className="w-px h-3.5 bg-line-200" />
            <MoveDateCard category="도착" text="경기도 고양시" />
          </article>
        </div>
        <div>
          <p className="text-right text-14-medium text-black-400">
            견적 금액 <span className="text-18-bold">180,000원</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <SolidButton>견적 확정하기</SolidButton>
          <OutlinedButton onClick={() => router.push("my-quotes/1")}>
            상세보기
          </OutlinedButton>
        </div>
      </section>
    </div>
  );
}
