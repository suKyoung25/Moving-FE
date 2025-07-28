import { Mover } from "@/lib/types";
import heart from "@/assets/images/likeFilledIcon.svg";
import inActiveHeart from "@/assets/images/likeOutlineIcon.svg";
import star from "@/assets/images/starFilledIcon.svg";
import Image from "next/image";

export default function MoverProfile({
   profileImage,
   nickName,
   favoriteCount,
   averageReviewRating,
   reviewCount,
   career,
   estimateCount,
   isFavorite,
}: Omit<Mover, "id" | "serviceType" | "region" | "description">) {
   return (
      <div className="flex items-center rounded-lg border border-gray-100 bg-white p-3 shadow-sm lg:p-4">
         <div className="relative mr-3 h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-blue-500 lg:mr-4 lg:h-16 lg:w-16">
            <Image
               src={profileImage || "/default-profile.png"}
               alt="프로필"
               fill
               className="object-cover"
            />
         </div>

         <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-start justify-between lg:mb-2">
               <span className="truncate text-sm font-semibold text-gray-800 lg:text-base">
                  {nickName} 기사님
               </span>
               <div className="ml-2 flex flex-shrink-0 items-center gap-1">
                  <Image
                     src={isFavorite ? heart : inActiveHeart}
                     width={16}
                     height={16}
                     alt="찜"
                     className="lg:h-5 lg:w-5"
                  />
                  <span className="text-xs text-gray-600 lg:text-sm">
                     {favoriteCount}
                  </span>
               </div>
            </div>

            <div className="space-y-1 text-xs text-gray-500 lg:flex lg:gap-3 lg:space-y-0 lg:text-sm">
               <div className="flex items-center gap-1">
                  <Image
                     src={star}
                     width={12}
                     height={12}
                     alt="별점"
                     className="lg:h-3.5 lg:w-3.5"
                  />
                  <span>{averageReviewRating}</span>
                  <span className="text-gray-400">({reviewCount})</span>
               </div>
               <div className="flex gap-3 lg:gap-4">
                  <span>경력 {career}년</span>
                  <span>확정 {estimateCount}건</span>
               </div>
            </div>
         </div>
      </div>
   );
}
