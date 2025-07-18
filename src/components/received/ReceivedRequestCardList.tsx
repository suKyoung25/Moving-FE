"use client";

export default function ReceivedRequestCardList() {
   const dummyData = [
      {
         id: "1",
         moveType: "소형이사",
         isDesignated: true,
         clientName: "김인서 고객님",
         moveDate: "2024. 07. 01(월)",
         fromAddress: "서울시 중구",
         toAddress: "경기도 수원시",
         timeAgo: "1시간 전",
      },
      {
         id: "2",
         moveType: "소형이사",
         isDesignated: true,
         clientName: "김인서 고객님",
         moveDate: "2024. 07. 01(월)",
         fromAddress: "서울시 중구",
         toAddress: "경기도 수원시",
         timeAgo: "1시간 전",
      },
      {
         id: "3",
         moveType: "소형이사",
         isDesignated: true,
         clientName: "홍성훈 고객님",
         moveDate: "2024. 07. 01(월)",
         fromAddress: "서울시 중구",
         toAddress: "경기도 수원시",
         timeAgo: "1시간 전",
      },
      {
         id: "5",
         moveType: "소형이사",
         isDesignated: true,
         clientName: "구봉산 고객님",
         moveDate: "2024. 07. 01(월)",
         fromAddress: "서울시 중구",
         toAddress: "경기도 남양주시",
         timeAgo: "1시간 전",
      },
   ];

   return (
      <div className="space-y-4">
         <p className="text-sm text-gray-500">전체 {dummyData.length}건</p>

         {dummyData.map((item) => (
            <div
               key={item.id}
               className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
               <div className="flex justify-between text-sm text-gray-400">
                  <div className="flex gap-2">
                     <span className="rounded bg-blue-100 px-2 py-0.5 font-medium text-blue-800">
                        {item.moveType}
                     </span>
                     {item.isDesignated && (
                        <span className="rounded bg-red-100 px-2 py-0.5 font-medium text-red-800">
                           지정 견적 요청
                        </span>
                     )}
                  </div>
                  <span>{item.timeAgo}</span>
               </div>

               <p className="mt-2 font-semibold">{item.clientName}</p>

               <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-600">
                  <span>이사일 {item.moveDate}</span>
                  <span className="mx-1">|</span>
                  <span>출발 {item.fromAddress}</span>
                  <span className="mx-1">|</span>
                  <span>도착 {item.toAddress}</span>
               </div>

               <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
                     견적 보내기 ✏️
                  </button>
                  <button className="flex-1 rounded-md border border-blue-500 px-4 py-2 text-sm font-medium text-blue-500 hover:bg-blue-50">
                     반려
                  </button>
               </div>
            </div>
         ))}
      </div>
   );
}
