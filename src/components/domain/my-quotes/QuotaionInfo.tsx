import MoveChip from "@/components/common/MoveChip";
import { isChipType } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface QuotaionInfoProps {
   fromAddress: string;
   toAddress: string;
   moveDate: string;
   moveType: string;
   requestedAt: string;
   chipType?: string;
   isRequestedTap?: boolean;
}

const formatMoveType = (moveType: string) => {
   const typeMap: Record<typeof moveType, string> = {
      SMALL: "소형이사",
      HOME: "가정이사",
      OFFICE: "사무실이사",
   };

   return typeMap[moveType] ?? moveType;
};

export default function QuotaionInfo({
   fromAddress,
   moveDate,
   moveType,
   toAddress,
   requestedAt,
   chipType,
   isRequestedTap,
}: QuotaionInfoProps) {
   return (
      <article>
         <p className="text-16-semibold lg:text-24-semibold mb-6 lg:mb-10">
            {isRequestedTap ? "요청 정보" : "견적 정보"}
         </p>
         <ul className="border-line-100 bg-bg-100 text-14-regular lg:text-18-regular flex flex-col gap-2.5 rounded-2xl border px-5 py-4">
            <li>
               {chipType && isChipType(chipType) && (
                  <MoveChip type={chipType} />
               )}
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">견적 요청일</p>
               <p className="">{format(requestedAt, "yy.MM.dd")}</p>
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">서비스</p>
               <p className="">{formatMoveType(moveType)}</p>
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">이사일</p>
               <p className="">
                  {format(moveDate, "yyyy. MM. dd(eee) aa hh:mm", {
                     locale: ko,
                  })}
               </p>
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">출발지</p>
               <p className="">{fromAddress}</p>
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">도착지</p>
               <p className="">{toAddress}</p>
            </li>
         </ul>
      </article>
   );
}
