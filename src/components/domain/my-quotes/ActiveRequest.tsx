"use client";

import { MOVE_TYPES } from "@/constants";
import { useActiveRequest } from "@/lib/api/request/requests/query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";

const contentClass =
   "flex md:w-fit items-center justify-between md:flex-col md:items-start";
const labelClass = "text-14-regular text-gray-300 md:text-16-medium";
const valueClass = "text-14-semibold text-black-300 md:text-18-semibold";

export default function ActiveRequest() {
   const { data: result, isPending } = useActiveRequest();
   const activeRequest = result?.data;
   console.log(activeRequest);

   const moveTypeMap = Object.entries(MOVE_TYPES).map(([label, value]) => ({
      label,
      value,
   }));

   if (isPending) return;

   if (!activeRequest) return;

   return (
      <article className="bg-primary-blue-50 px-6 py-5 break-keep md:px-18 md:py-8 lg:px-0">
         <div className="flex w-full gap-5 max-lg:flex-col md:gap-7 lg:mx-auto lg:max-w-350">
            <div className="flex w-full flex-col">
               <span className="text-12-semibold md:text-14-semibold text-primary-blue-300 mb-2">
                  내 견적 요청
               </span>
               <h2 className="text-black-500 text-18-semibold md:text-24-semibold">
                  {
                     moveTypeMap.find(
                        (item) => item.value === activeRequest.moveType,
                     )?.label
                  }
               </h2>
               <div className="text-12-regular md:text-16-medium text-gray-500">
                  견적 요청일:{" "}
                  {format(activeRequest.requestedAt, "yyyy년 MM월 dd일")}
               </div>
            </div>
            <div className="flex w-full max-md:flex-col max-md:gap-1 md:gap-10 lg:items-center lg:justify-end">
               <div className="w-full md:flex md:w-fit md:gap-3">
                  <div className={contentClass}>
                     <div className={labelClass}>출발지</div>
                     <div className={valueClass}>
                        {activeRequest.fromAddress}
                     </div>
                  </div>
                  <IoIosArrowRoundForward className="h-6 w-6 self-end max-md:hidden" />
                  <div className={contentClass}>
                     <div className={labelClass}>도착지</div>
                     <div className={valueClass}>{activeRequest.toAddress}</div>
                  </div>
               </div>
               <div className={contentClass}>
                  <div className={labelClass}>이사 예정일</div>
                  <div className={valueClass}>
                     {format(activeRequest.moveDate, "yyyy년 MM월 dd일 (eee)", {
                        locale: ko,
                     })}
                  </div>
               </div>
            </div>
         </div>
      </article>
   );
}
