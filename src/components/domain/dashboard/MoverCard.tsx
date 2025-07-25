import Image from "next/image";
import React from "react";
import avatar from "@/assets/images/avatarIcon.svg"; // TODO: 추후 실제 이미지로 변경
import EditButtons from "./EditButtons";
import MoverInfo from "./MoverInfo";

// TODO: 타입 합치기
interface MoverCard {
   id: string;
   name?: string;
   profileImage?: string;
   nickName: string;
   career: number;
   introduction?: string;
   description?: string;
   serviceType: string[];
   serviceArea: string[];
   favoriteCount: number;
   estimateCount: number;
   averageReviewRating: number;
   reviewCount: number;
   isFavorite?: boolean;
}

export default function MoverCard({ mover }: { mover: MoverCard }) {
   return (
      <section className="bg-bg-100 flex flex-col gap-4 rounded-2xl border border-gray-100 px-4 py-[14px] lg:p-6">
         <div className="flex items-center gap-4 lg:justify-between">
            <div className="block lg:hidden">
               <Image src={avatar} alt="프로필 이미지" className="h-16 w-16" />
            </div>
            <div className="lg:space-y-2">
               <p className="font-semibold lg:text-2xl">{mover.nickName}</p>
               <p className="text-sm font-normal text-gray-400 lg:text-xl">
                  {mover.introduction}
               </p>
            </div>
            <div className="flex w-144 gap-4 max-lg:hidden lg:inline-flex">
               <EditButtons />
            </div>
         </div>
         <div className="border-line-200 rounded-md border p-2.5 lg:flex lg:items-center lg:gap-6 lg:px-[18px] lg:py-6">
            <div className="hidden lg:block">
               <Image src={avatar} alt="프로필 이미지" className="h-16 w-16" />
            </div>
            <MoverInfo
               averageReviewRating={mover.averageReviewRating}
               reviewCount={mover.reviewCount}
               estimateCount={mover.estimateCount}
               career={mover.career}
               serviceType={mover.serviceType}
               serviceArea={mover.serviceArea}
            />
         </div>
      </section>
   );
}
