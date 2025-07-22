"use client";

import MoverProfileclient from "./MoverProfileClient";

export default function ReceivedCard() {
   return (
      <div
         style={{
            boxShadow:
               "-2px -2px 10px rgba(220, 220, 220, 0.2), 2px 2px 10px rgba(220, 220, 220, 0.14)",
         }}
         className="flex w-full cursor-pointer flex-col gap-2 rounded-2xl bg-white px-3.5 pt-5 pb-3.5 lg:px-6 lg:pt-7 lg:pb-5.5"
      >
         <MoverProfileclient
            moveType="HOME"
            isDesignated={true}
            moverName="홍길동 이사님"
            profileImage={null}
            isFavorited={false}
            averageReviewRating={4.8}
            reviewCount={12}
            career={5}
            estimateCount={120}
            favoriteCount={30}
            quotesStatus="received"
         />
         <div className="flex items-center justify-end gap-2">
            <p className="text-14-medium lg:text-18-medium">견적금액</p>
            <p className="text-18-bold lg:text-24-bold">180,000원</p>
         </div>
      </div>
   );
}
