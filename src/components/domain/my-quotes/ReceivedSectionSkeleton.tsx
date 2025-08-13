// src/components/domain/my-quotes/ReceivedSectionSkeleton.tsx
"use client";

import React from "react";

type Props = {
   /** 리스트에 표시할 카드 개수 */
   cardCount?: number;
};

export default function ReceivedSectionSkeleton({ cardCount = 3 }: Props) {
   return (
      <section className="md:border-line-100 animate-pulse shadow md:mx-auto md:w-150 md:rounded-3xl md:border md:px-8 md:py-4 lg:w-350 lg:px-10 lg:py-12">
         {/* 섹션 타이틀 */}
         <div className="mb-6 lg:mb-10">
            <div className="h-6 w-32 rounded bg-gray-200 lg:h-7 lg:w-40" />
         </div>

         {/* 견적 정보 박스 (QuotationInfo 대체) */}
         <QuotationInfoSkeleton />

         {/* "견적서 목록" 타이틀 + 드롭다운 자리 */}
         <div className="mt-8 lg:mt-10.5">
            <div className="mb-6 flex items-center justify-between lg:mb-10">
               <div className="h-6 w-32 rounded bg-gray-200 lg:h-7 lg:w-40" />
               {/* Dropdown 버튼 모양 */}
               <div className="h-9 w-24 rounded-lg bg-gray-100 lg:h-10" />
            </div>
         </div>

         {/* 카드 리스트 */}
         <div className="mt-4 flex flex-col gap-6 md:gap-8 lg:mt-8 lg:gap-14">
            {Array.from({ length: cardCount }).map((_, i) => (
               <ReceivedCardSkeleton key={i} />
            ))}
         </div>
      </section>
   );
}

/* ===========================
 * Child Skeleton Components
 * =========================== */

function QuotationInfoSkeleton() {
   return (
      <article className="relative">
         <ul className="border-line-100 bg-bg-100 text-14-regular lg:text-18-regular flex flex-col gap-2.5 rounded-2xl border px-5 py-4">
            {/* 칩 자리 */}
            <li>
               <div className="h-6 w-16 rounded-full bg-gray-100" />
            </li>

            {/* 요청일 */}
            <RowSkeleton labelWidth="w-16.5 lg:w-22.5" valueWidth="w-24" />
            {/* 서비스 */}
            <RowSkeleton labelWidth="w-16.5 lg:w-22.5" valueWidth="w-20" />
            {/* 이사일 */}
            <RowSkeleton
               labelWidth="w-16.5 lg:w-22.5"
               valueWidth="w-56 lg:w-72"
            />
            {/* 출발지 */}
            <RowSkeleton
               labelWidth="w-16.5 lg:w-22.5"
               valueWidth="w-64 lg:w-96"
            />
            {/* 도착지 */}
            <RowSkeleton
               labelWidth="w-16.5 lg:w-22.5"
               valueWidth="w-64 lg:w-96"
            />
         </ul>
      </article>
   );
}

function RowSkeleton({
   labelWidth,
   valueWidth,
}: {
   labelWidth: string;
   valueWidth: string;
}) {
   return (
      <li className="flex items-center gap-10">
         <div className={`h-4 ${labelWidth} rounded bg-gray-100`} />
         <div className={`h-4 ${valueWidth} rounded bg-gray-100`} />
      </li>
   );
}

function ReceivedCardSkeleton() {
   return (
      <section className="w-full rounded-2xl bg-white px-3 pt-5 pb-3.5 shadow lg:mx-0 lg:px-6 lg:pt-7 lg:pb-5.5">
         {/* 상단: 배지들 + 견적 번호(타이틀 느낌) */}
         <div className="mb-3 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
               <div className="bg-primary-blue-200 h-6 w-16 rounded-full" />
               <div className="bg-primary-blue-300 h-6 w-16 rounded-full" />
            </div>
            <div className="h-5 w-40 rounded bg-gray-200" />
         </div>

         {/* 프로필/평가 줄 */}
         <div className="border-line-100 mb-3.5 flex items-center justify-between rounded-2xl border px-3 py-2 lg:px-4 lg:py-3">
            <div className="flex items-center gap-3.5">
               <div className="h-10 w-10 rounded-full bg-gray-200 lg:h-12 lg:w-12" />
               <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="flex items-center gap-3">
                     <div className="h-3 w-14 rounded bg-gray-100" />
                     <div className="h-3 w-12 rounded bg-gray-100" />
                     <div className="h-3 w-12 rounded bg-gray-100" />
                  </div>
               </div>
            </div>

            {/* 우측 하트/카운트 자리 */}
            <div className="flex items-center gap-2">
               <div className="h-5 w-5 rounded-full bg-gray-100" />
               <div className="h-4 w-5 rounded bg-gray-100" />
            </div>
         </div>

         {/* 가격 */}
         <div className="mb-3 text-right">
            <div className="ml-auto h-5 w-28 rounded bg-gray-100" />
         </div>
      </section>
   );
}
