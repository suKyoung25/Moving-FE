// src/app/my-quotes/mover/[id]/page.tsx

import { getSentEstimateDetail } from "@/lib/api/my-quotes/getSentEstimateDetail";
import { DesignatedRequest } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function Page({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = await params;

   if (!id) return notFound();

   const estimate = await getSentEstimateDetail(id);

   if (!estimate || !estimate.request) return notFound();

   const { request, price } = estimate;

   return (
      <div className="space-y-8">
         {/* 상단 Chips + 고객명 + 기본 정보 */}
         <div className="rounded-xl bg-white px-6 py-5 shadow">
            <div className="mb-4 flex flex-wrap items-center gap-2">
               <div className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                  {request.moveType || "이사 타입"}
               </div>
               {request.designatedRequest?.some(
                  (d: DesignatedRequest) => d.moverId === estimate.moverId,
               ) && (
                  <div className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">
                     지정 견적 요청
                  </div>
               )}
            </div>
            <p className="mb-3 text-lg font-semibold">
               {request.client?.name ?? "고객명 미상"} 고객님
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
               <span className="text-gray-500">이사일</span>
               <span>
                  {request.moveDate
                     ? `${request.moveDate.slice(0, 10)} (${["일", "월", "화", "수", "목", "금", "토"][new Date(request.moveDate).getDay()]})`
                     : "미정"}
               </span>
               <span className="text-gray-300">|</span>
               <span>출발</span>
               <span>{request.fromAddress ?? "출발지 없음"}</span>
               <span className="text-gray-300">|</span>
               <span>도착</span>
               <span>{request.toAddress ?? "도착지 없음"}</span>
            </div>
         </div>

         {/* 견적가 */}
         <div className="rounded-xl bg-white px-6 py-5 shadow">
            <p className="mb-2 text-base text-gray-500">견적가</p>
            <p className="text-3xl font-bold text-gray-900">
               {price
                  ? `${Number(price).toLocaleString()}원`
                  : "가격 정보 없음"}
            </p>
         </div>

         {/* 견적 정보 */}
         <div className="rounded-xl bg-white px-6 py-5 shadow">
            <p className="mb-4 text-base font-semibold text-gray-800">
               견적 정보
            </p>
            <div className="space-y-2 text-sm text-gray-700">
               <div className="flex justify-between">
                  <span className="text-gray-500">견적 요청일</span>
                  <span>
                     {request.requestedAt
                        ? request.requestedAt.slice(2, 10).replaceAll("-", ".")
                        : "정보 없음"}
                  </span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-500">서비스</span>
                  <span>{request.moveType ?? "이사 타입 없음"}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-500">이용일</span>
                  <span>
                     {request.moveDate
                        ? new Date(request.moveDate).toLocaleDateString(
                             "ko-KR",
                             {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                weekday: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                             },
                          )
                        : "미정"}
                  </span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-500">출발지</span>
                  <span>{request.fromAddress ?? "출발지 없음"}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-500">도착지</span>
                  <span>{request.toAddress ?? "도착지 없음"}</span>
               </div>
            </div>
         </div>
      </div>
   );
}
