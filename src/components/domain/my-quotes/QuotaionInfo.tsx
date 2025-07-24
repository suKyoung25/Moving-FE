interface QuotaionInfoProps {
   fromAddress: string;
   toAddress: string;
   moveDate: string;
   moveType: string;
   requestedAt: string;
}

type DateFormatOption = "full" | "short";

const formatKoreanDate = (
   isoString: string,
   format: DateFormatOption = "full",
) => {
   const date = new Date(isoString);

   const yearFull = date.getFullYear();
   const yearShort = String(yearFull).slice(2); // 24
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const day = String(date.getDate()).padStart(2, "0");

   if (format === "short") {
      return `${yearShort}.${month}.${day}`;
   }

   // full 형식일 때
   const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
   const weekday = weekdays[date.getDay()];

   const hours = date.getHours();
   const period = hours < 12 ? "오전" : "오후";
   const hours12 = hours % 12 || 12;
   const minutes = String(date.getMinutes()).padStart(2, "0");

   return `${yearFull}. ${month}. ${day}(${weekday}) ${period} ${hours12}:${minutes}`;
};

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
}: QuotaionInfoProps) {
   return (
      <article>
         <p className="text-16-semibold lg:text-24-semibold mb-6 lg:mb-10">
            견적 정보
         </p>
         <ul className="border-line-100 bg-bg-100 text-14-regular lg:text-18-regular flex flex-col gap-2.5 rounded-2xl border px-5 py-4">
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">견적 요청일</p>
               <p className="">{formatKoreanDate(requestedAt, "short")}</p>
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">서비스</p>
               <p className="">{formatMoveType(moveType)}</p>
            </li>
            <li className="flex items-center gap-10">
               <p className="w-16.5 text-gray-300 lg:w-22.5">이용일</p>
               <p className="">{formatKoreanDate(moveDate)}</p>
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
