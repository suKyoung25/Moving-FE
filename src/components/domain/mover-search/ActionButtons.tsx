"use client";

import { Mover } from "@/lib/types";
import { FavoriteButton } from "./FavoriteButton";
import { EstimateRequestButton } from "./EstimateRequestButton";

export default function ActionButtons({ mover }: { mover: Mover }) {
   return (
      <div className="p-4 lg:p-5">
         <div className="mb-4 hidden lg:block">
            <p className="mb-1 text-base font-medium text-gray-900">
               {mover.nickName} 기사님에게 지정 견적을 요청해보세요!
            </p>
         </div>

         <div className="flex flex-row lg:flex-col space-x-3 lg:space-y-3 ">
            <FavoriteButton mover={mover} />
            <EstimateRequestButton moverId={mover.id} />
         </div>
      </div>
   );
}

