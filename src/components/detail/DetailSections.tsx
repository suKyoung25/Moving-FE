import { Mover } from "@/lib/types/mover.types";
import LineDivider from "./LineDivider";

export default function DetailSections({ mover }: { mover: Mover }) {
   return (
      <div className="space-y-6">
         {/* 상세설명 */}
         <div className="p-4 lg:p-5">
            <h3 className="mb-4 text-lg font-bold text-gray-900">상세설명</h3>
            <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700 lg:text-base">
               {mover.description || "소개글이 없습니다."}
            </div>
         </div>

         <LineDivider />

         {/* 제공 서비스 */}
         <div className="p-4 lg:p-5">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
               제공 서비스
            </h3>
            <ServiceTags services={mover.serviceType} />
         </div>

         <LineDivider />

         {/* 서비스 가능 지역 */}
         <div className="p-4 lg:p-5">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
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
      const serviceMap: { [key: string]: string } = {
         SMALL: "소형이사",
         HOME: "가정이사",
         OFFICE: "사무실이사",
      };
      return serviceMap[type] || type;
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

// 지역 태그 컴포넌트
function RegionTags({ regions }: { regions?: string[] }) {
   if (!regions || regions.length === 0) {
      return <p className="text-sm text-gray-400">등록된 지역이 없습니다.</p>;
   }

   return (
      <div className="flex flex-wrap gap-2">
         {regions.map((region) => (
            <span
               key={region}
               className="inline-block rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-sm text-gray-700"
            >
               {region}
            </span>
         ))}
      </div>
   );
}
