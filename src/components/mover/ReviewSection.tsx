import React from "react";
import ReviewBreakdown from "./ReviewBreakdown";
import ReviewStar from "./ReviewStar";
import ReviewList from "./ReviewList";

const reviewMocks = [
   {
      id: "review1",
      rating: 5,
      content: `듣던대로 정말 친절하시고 물건도 잘 옮겨주셨어요~~
나중에 또 집 옮길 일 있으면 김코드 기사님께 부탁드릴 예정입니다!!
비 오는데 꼼꼼히 잘 해주셔서 감사드립니다 :)`,
      createdAt: "2025-07-17T11:22:24.419Z",
      clientId: "client1",
      clientName: "김수경",
   },
   {
      id: "review2",
      rating: 5,
      content:
         "기사님 덕분에 안전하고 신속한 이사를 했습니다! 정말 감사합니다~",
      createdAt: "2025-07-13T11:22:24.419Z",
      clientId: "client2",
      clientName: "양성경",
   },
   {
      id: "review3",
      rating: 4,
      content:
         "비오는 날에도 친절하고 신속하게 이사를 도와주셔서 너무 만족했습니다. 하지만 날씨 때문에 1점 깎습니다..",
      createdAt: "2025-07-10T11:22:24.419Z",
      clientId: "client3",
      clientName: "심유빈",
   },
   {
      id: "review4",
      rating: 1,
      content:
         "이사하는 집에 엘레베이터가 없다고 짐을 그냥 1층에 두고 가셨어요. 서비스 정신이 너무 없으신 듯 합니다.",
      createdAt: "2025-07-13T11:22:24.419Z",
      clientId: "client4",
      clientName: "홍성훈",
   },
   {
      id: "review5",
      rating: 5,
      content:
         "만족스러운 서비스였습니다. 다음에도 기사님께 이사를 부탁드리고 싶습니다.",
      createdAt: "2025-07-15T11:22:24.419Z",
      clientId: "client5",
      clientName: "임정빈",
   },
   {
      id: "review6",
      rating: 5,
      content:
         "무빙 사이트 처음 이용해봤는데 좋은 기사님 만나서 무사히 이사를 할 수 있었습니다~",
      createdAt: "2025-07-09T11:22:24.419Z",
      clientId: "client2",
      clientName: "신수민",
   },
   {
      id: "review7",
      rating: 5,
      content: "기사님 최고",
      createdAt: "2025-07-11T11:22:24.419Z",
      clientId: "client2",
      clientName: "오하영",
   },
];

export default function ReviewSection({
   averageReviewRating,
   reviewCount,
}: {
   averageReviewRating: number;
   reviewCount: number;
}) {
   return (
      <section>
         <h1 className="font-bold lg:text-2xl">리뷰 ({reviewCount})</h1>
         <div className="lg:bg-bg-200 flex max-md:flex-col max-md:items-center md:mt-8 md:justify-center md:gap-14 lg:mb-10 lg:items-center lg:gap-[83px] lg:rounded-4xl lg:py-10">
            <div className="mt-8 mb-10 flex flex-col gap-[15px]">
               <div className="flex items-center justify-center gap-2 font-bold">
                  <div className="text-4xl lg:text-6xl">
                     {averageReviewRating.toFixed(1)}
                  </div>
                  <div className="justify-start text-2xl text-gray-100 lg:text-4xl">
                     / 5
                  </div>
               </div>
               <ReviewStar rating={averageReviewRating} />
            </div>
            <div className="bg-bg-200 flex w-80 justify-center rounded-3xl px-[18px] py-4 max-md:mb-[43px] lg:w-fit">
               <ReviewBreakdown reviews={reviewMocks} />
            </div>
         </div>
         <ReviewList reviews={reviewMocks} />
      </section>
   );
}
