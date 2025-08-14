// src/components/domain/my-quotes/QuotationInfoSkeleton.tsx
"use client";

import React from "react";

type Props = {
   /** pending 상태일 때 우측 상단 more 버튼/메뉴 자리도 스켈레톤으로 보여줄지 */
   withPendingMenu?: boolean;
};

export default function QuotationInfoSkeleton({
   withPendingMenu = false,
}: Props) {
   return (
      <article className="relative">
         <ul className="border-line-100 text-14-regular lg:text-18-regular flex animate-pulse flex-col gap-2.5 rounded-2xl border px-5 py-4 shadow">
            {/* 칩 자리 */}
            <li className="itesm-center flex gap-2">
               <div className="bg-primary-blue-200 h-6 w-16 rounded-sm" />
               <div className="bg-primary-blue-300 h-6 w-16 rounded-sm" />
            </li>

            {/* 요청일 */}
            <RowSkeleton labelWidth="w-16.5 lg:w-22.5" valueWidth="w-24" />
            {/* 서비스 */}
            <RowSkeleton labelWidth="w-16.5 lg:w-22.5" valueWidth="w-20" />
            {/* 이사일 (조금 길게) */}
            <RowSkeleton
               labelWidth="w-16.5 lg:w-22.5"
               valueWidth="w-56 lg:w-72"
            />
            {/* 출발지/도착지 (길게) */}
            <RowSkeleton
               labelWidth="w-16.5 lg:w-22.5"
               valueWidth="w-64 lg:w-96"
            />
            <RowSkeleton
               labelWidth="w-16.5 lg:w-22.5"
               valueWidth="w-64 lg:w-96"
            />
         </ul>

         {withPendingMenu && (
            <>
               {/* more 아이콘 자리 */}
               <div className="absolute top-6 right-2.5 h-4 w-4 rounded-full bg-gray-200" />
               {/* 드롭다운 버튼 자리 */}
               <div className="border-line-100 absolute top-10 right-2.5 h-9 w-24 rounded-lg border bg-white lg:h-16 lg:w-28" />
            </>
         )}
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
