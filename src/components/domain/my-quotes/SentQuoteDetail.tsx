import MoveChip from "@/components/common/MoveChip";
import PageTitle from "@/components/layout/PageTitle";
import { getSentEstimateDetail } from "@/lib/api/estimate/requests/getSentEstimateDetail";
import { notFound } from "next/navigation";
import MoveTextCard from "./MoveTextCard";
import SocialShareGroup from "@/components/common/SocialShareGroup";

export default async function SentQuoteDetail({ id }: { id: string }) {
   const estimate = await getSentEstimateDetail(id);

   if (!estimate || !estimate.request) return notFound();

   const { request, price, isClientConfirmed, createdAt } = estimate;

   console.log(request, price, isClientConfirmed);

   return (
      <div>
         <PageTitle title={"견적 상세"} />
         <div className="mt-4 lg:flex lg:gap-40">
            <article className="flex flex-col gap-6 lg:flex-1 lg:gap-10">
               <div className="border-line-100 rounded-2xl border bg-white px-3.5 py-4 lg:px-6 lg:py-5">
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-2 lg:gap-3">
                        {isClientConfirmed && (
                           <div className="w-fit rounded-sm bg-gray-800 px-1.5 py-0.5 lg:py-1">
                              <span className="text-13-semibold lg:text-16-semibold">
                                 견적 확정
                              </span>
                           </div>
                        )}
                        <MoveChip type={request.moveType} />
                        {request.designatedRequest.length > 0 && (
                           <MoveChip type="DESIGNATED" />
                        )}
                     </div>
                     <div>
                        <p className="text-16-semibold lg:text-20-semibold">
                           {request.client.name} 고객님
                        </p>
                     </div>
                     <div className="flex items-center gap-2 md:hidden">
                        <MoveTextCard text="이사일" />
                        <span className="text-14-medium lg:text-18-medium">
                           {request.moveDate.slice(0, 10)} (
                           {
                              "일월화수목금토"[
                                 new Date(request.moveDate).getDay()
                              ]
                           }
                           )
                        </span>
                     </div>
                     <div className="border-line-100 border"></div>
                     <div className="flex gap-3.5 lg:gap-4 [&_div]:flex [&_div]:items-center [&_div]:gap-2">
                        <div className="!hidden md:!flex">
                           <MoveTextCard text="이사일" />
                           <span className="text-14-medium lg:text-18-medium">
                              {request.moveDate.slice(0, 10)} (
                              {
                                 "일월화수목금토"[
                                    new Date(request.moveDate).getDay()
                                 ]
                              }
                              )
                           </span>
                        </div>
                        <div>
                           <MoveTextCard text="출발" />
                           <span className="text-14-medium lg:text-18-medium">
                              {request.fromAddress.slice(0, 6)}
                           </span>
                        </div>
                        <div>
                           <MoveTextCard text="도착" />
                           <span className="text-14-medium lg:text-18-medium">
                              {request.toAddress.slice(0, 6)}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="border-line-100 border lg:hidden"></div>
               <div className="lg:hidden">
                  <SocialShareGroup text="견적서 공유하기" />
               </div>
               <div className="border-line-100 border"></div>
               <div className="flex flex-col gap-4 lg:gap-6">
                  <span className="text-16-semibold lg:text-24-semibold">
                     견적가
                  </span>
                  <p className="text-20-bold lg:text-32-bold">
                     {Number(price).toLocaleString()}원
                  </p>
               </div>
               <div className="border-line-100 border"></div>
               <div>
                  <PageTitle title={"견적 정보"} />
                  <ul className="bg-bg-100 border-line-100 [&_label]:text-14-regular [&_span]:text-14-regular [&_span]:lg:text-18-regular [&_label]:lg:text-18-regular mt-4 flex flex-col gap-2.5 rounded-2xl border px-5 py-4 lg:gap-4 lg:px-6 lg:py-5 [&_label]:min-w-16 [&_label]:text-gray-300 [&_label]:lg:min-w-22 [&_li]:flex [&_li]:items-center [&_li]:gap-10">
                     <li>
                        <label>견적 요청일</label>
                        <span>{createdAt.slice(0, 10)}</span>
                     </li>
                     <li>
                        <label>서비스</label>
                        <span>{request.moveType}이사</span>
                     </li>
                     <li>
                        <label>출발지</label>
                        <span>{request.fromAddress}</span>
                     </li>
                     <li>
                        <label>도착지</label>
                        <span>{request.toAddress}</span>
                     </li>
                  </ul>
               </div>
            </article>
            <article className="hidden h-fit w-60 lg:block">
               <SocialShareGroup text="견적서 공유하기" />
            </article>
         </div>
      </div>
   );
}
