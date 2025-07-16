"use client";

import React, { useEffect, useState } from "react";
import MoveChip from "@/components/common/chips/MoveChip";
import MoverProfile from "@/components/common/profile/MoverProfile";
import profile from "@/assets/images/profileIcon.svg";
import MoveDateCard from "../common/MoveDateCard";
import SolidButton from "@/components/common/buttons/SolidButton";
import OutlinedButton from "@/components/common/buttons/OutlinedButton";
import { useRouter } from "next/navigation";
import { fetchPendingQuotes } from "@/lib/api/my-quotes/getMyQuotes";
import { pendingQuote } from "@/lib/types/quotes.types";
import emptyQuotes from "@/assets/images/emptyBlueFolderIcon.svg";
import Image from "next/image";

// const data = [
//    {
//       requestId: "a818fac9-ce84-4440-bfa4-71a89438d7da",
//       moveDate: "2025-08-01T09:00:00.000Z",
//       fromAddress: "서울 강남구 테헤란로 1",
//       toAddress: "경기 성남시 분당구 판교로 1",
//       estimates: [
//          {
//             estimateId: "c562bd92-367f-4178-b39f-6348348b40b8",
//             moverId: "a61f9424-1df9-40d8-aabd-bc4e18103639",
//             moverName: "기사1",
//             moverNickName: "이사짱1",
//             profileImage: null,
//             comment: "엘리베이터 있음, 짐 많음",
//             price: 250000,
//             created: "2025-07-14T11:30:32.131Z",
//             isDesignated: true,
//             isFavorited: {
//                id: "419fe731-bf24-4773-99a0-5e8764850d8e",
//                clientId: "6328af51-4c80-4ec2-a5d7-809a2a3dc5ad",
//                moverId: "a61f9424-1df9-40d8-aabd-bc4e18103639",
//             },
//          },
//          {
//             estimateId: "d0b6bc91-5ad0-447a-b307-293ad2ebdc48",
//             moverId: "83aef138-0eaa-4c06-8869-5fa19583b530",
//             moverName: "무버",
//             moverNickName: null,
//             profileImage: null,
//             comment: "나 김정은인데 남한으로 이사가고 싶엉",
//             price: 10,
//             created: "2025-07-15T15:15:03.257Z",
//             isDesignated: false,
//             isFavorited: null,
//          },
//       ],
//    },
//    {
//       requestId: "6ff26996-b5d9-4b69-808a-4adc47ee5eb8",
//       moveDate: "2025-07-09T00:00:00.000Z",
//       fromAddress: "대전 서구 가수원로 17-19",
//       toAddress: "부산 해운대구 구남로 5",
//       estimates: [
//          {
//             estimateId: "d0b6bc91-5ad0-447a-b307-293ad2ebdc43",
//             moverId: "83aef138-0eaa-4c06-8869-5fa19583b530",
//             moverName: "무버",
//             moverNickName: null,
//             profileImage: null,
//             comment: "나 김정은인데 남한으로 이사가고 싶엉",
//             price: 10,
//             created: "2025-07-15T15:15:03.257Z",
//             isDesignated: false,
//             isFavorited: null,
//          },
//       ],
//    },
// ];

// 대기중인 견적

export default function Pending() {
   const [data, setData] = useState<pendingQuote[]>();
   const router = useRouter();

   useEffect(() => {
      async function getMyPendingQuotes() {
         const result = await fetchPendingQuotes();
         setData(result.data);
      }

      getMyPendingQuotes();
   }, []);

   if (!Array.isArray(data) || data.length === 0)
      return (
         <div className="mt-32 flex flex-col items-center justify-center gap-8">
            <Image src={emptyQuotes} alt="대기중인 견적 없음" />
            <p className="text-16-regular md:text-24-regular text-center text-gray-400">
               기사님들이 열심히 확인 중이에요!
               <br />곧 견적이 도착할 거에요!
            </p>
         </div>
      );

   return (
      <div className="text-black-300 flex flex-col gap-6 md:gap-8 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-10.5">
         {data.flatMap((request) =>
            request.estimates.map((estimate) => (
               <section
                  key={estimate.estimateId}
                  style={{
                     boxShadow:
                        "-2px -2px 10px rgba(220, 220, 220, 0.2), 2px 2px 10px rgba(220, 220, 220, 0.2)",
                  }}
                  className="mx-auto flex w-full flex-col gap-2 rounded-2xl bg-white px-3 pt-5 pb-3.5 lg:mx-0 lg:w-172 lg:px-6 lg:pt-7 lg:pb-5.5"
               >
                  <div className="flex flex-col gap-3.5">
                     <article className="flex items-center gap-2">
                        {/* todo: moveType 추가하기 */}
                        <MoveChip type="PENDING" />
                        {estimate.isDesignated && (
                           <MoveChip type="DESIGNATED" />
                        )}
                     </article>
                     <MoverProfile
                        nickName={estimate.moverNickName || estimate.moverName}
                        profileImage={estimate.profileImage || profile}
                        isLiked={!!estimate.isFavorited}
                        handleLikedClick={() => console.log("찜 토글")}
                        // todo: 기사님 상세 정보 추가하기
                        averageReviewRating={4.5}
                        reviewCount={3}
                        career={7}
                        estimateCount={171}
                        favoriteCount={5}
                     />
                     <MoveDateCard
                        category="이사일"
                        text={new Date(request.moveDate).toLocaleDateString()}
                     />
                     <article className="flex items-center gap-3.5">
                        <MoveDateCard
                           category="출발"
                           text={request.fromAddress}
                        />
                        <div className="bg-line-200 h-3.5 w-px" />
                        <MoveDateCard
                           category="도착"
                           text={request.toAddress}
                        />
                     </article>
                  </div>
                  <div>
                     <p className="text-14-medium text-black-400 text-right">
                        견적 금액{" "}
                        <span className="text-18-bold">
                           {estimate.price.toLocaleString()}원
                        </span>
                     </p>
                  </div>
                  <div className="flex flex-col gap-2 md:flex-row">
                     <SolidButton>견적 확정하기</SolidButton>
                     <OutlinedButton
                        onClick={() =>
                           router.push(`my-quotes/${request.requestId}`)
                        }
                     >
                        상세보기
                     </OutlinedButton>
                  </div>
               </section>
            )),
         )}
      </div>
   );
}
