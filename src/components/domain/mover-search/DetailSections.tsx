import React from "react";
import { Mover, Region } from "@/lib/types";
import LineDivider from "../../common/LineDivider";
import { serviceTypeMap } from "@/constants/profile.constants";

export default function DetailSections({ mover }: { mover: Mover }) {
   return (
      <div className="space-y-6">
         {/* 상세설명 */}
         <div className="p-4 lg:p-5">
            <h3 className="text-18-semibold lg:text-20-bold mb-4">상세설명</h3>
            <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700 lg:text-base">
               {mover.description || "소개글이 없습니다."}
            </div>
         </div>

         <LineDivider />

         {/* 제공 서비스 */}
         <div className="p-4 lg:p-5">
            <h3 className="text-18-semibold lg:text-20-bold mb-4">
               제공 서비스
            </h3>
            <ServiceTags services={mover.serviceType} />
         </div>

         <LineDivider />

         {/* 서비스 가능 지역 */}
         <div className="p-4 lg:p-5">
            <h3 className="text-18-semibold lg:text-20-bold mb-4">
               서비스 가능 지역
            </h3>
            <RegionTags regions={mover.serviceArea} />
         </div>
      </div>
   );
}

// 서비스 태그 컴포넌트
function ServiceTags({ services }: { services?: string[] }) {
   const getServiceTypeLabel = (type: string) => {
      return serviceTypeMap[type as keyof typeof serviceTypeMap] || type;
   };

   if (!services || services.length === 0) {
      return <p className="text-sm text-gray-400">등록된 서비스가 없습니다.</p>;
   }

   return (
      <div className="flex flex-wrap gap-2">
         {services.map((service) => (
            <span
               key={service}
               className="inline-block rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-600"
            >
               {getServiceTypeLabel(service)}
            </span>
         ))}
      </div>
   );
}

// 지역 태그 컴포넌트 - string[] 및 Region[] 모두 처리
function RegionTags({ regions }: { regions?: Region[] | string[] }) {
   if (!regions || regions.length === 0) {
      return <p className="text-sm text-gray-400">등록된 지역이 없습니다.</p>;
   }

   return (
      <div className="flex flex-wrap gap-2">
         {regions.map((region, index) => {
            let regionName: string;
            let key: string | number;

            // region이 문자열인지 객체인지 확인
            if (typeof region === "string") {
               regionName = region;
               key = index;
            } else if (
               region &&
               typeof region === "object" &&
               "regionName" in region
            ) {
               // Region 객체인 경우
               regionName = region.regionName;
               key = region.id || index;
            } else {
               regionName = String(region);
               key = index;
            }

            return (
               <span
                  key={key}
                  className="bg-bg-100 inline-block rounded-full border border-gray-100 px-3 py-1.5 text-sm text-gray-700"
               >
                  {regionName}
               </span>
            );
         })}
      </div>
   );
}
