"use client";

import MoverProfile from "@/components/common/MoverProfile";
import React, { useEffect, useState } from "react";
import MoveChip from "@/components/common/MoveChip";
import { getFavoriteMovers } from "@/lib/api/favorite/getFavoriteMovers";
import { isChipType } from "@/lib/utils/moveChip.util";
import Pagination from "@/components/common/pagination";

interface FavoriteMover {
   id: string;
   nickName: string;
   profileImage: string | null;
   favoriteCount: number;
   averageReviewRating: number;
   reviewCount: number;
   career: number | null;
   estimateCount: number;
   serviceType: string[];
}

export default function FavoriteMover() {
   const [movers, setMovers] = useState<FavoriteMover[]>([]);
   const [isLiked, setIsLiked] = useState(true);
   // 페이지네이션
   const [pagination, setPagination] = useState(() => {
      let initialLimit = 6;
      if (typeof window !== "undefined" && window.innerWidth < 1440) {
         initialLimit = 4;
      }
      return {
         page: 1,
         limit: initialLimit,
         totalPages: 1,
      };
   });

   const handleLikedClick = () => {
      setIsLiked((prev) => !prev);
   };

   const handlePageChange = (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
   };

   useEffect(() => {
      async function fetchData() {
         try {
            const res = await getFavoriteMovers(
               pagination.page,
               pagination.limit,
            );
            setMovers(res.data.movers);
            setPagination(res.data.pagination);
         } catch (error) {
            console.error(error);
         }
      }
      fetchData();
   }, [pagination.page, pagination.limit]);

   return (
      <>
         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {movers.map((mover) => (
               <div
                  key={mover.id}
                  className="border-line-100 h-37.5 w-full rounded-2xl border bg-white px-3.5 py-4 shadow-[2px_2px_10px_0px_rgba(220,220,220,0.10),_-2px_-2px_10px_0px_rgba(220,220,220,0.10)] md:mb-2 lg:mb-6 lg:h-50.5 lg:px-6 lg:py-5"
               >
                  <div className="mb-3.5 flex gap-2 lg:gap-3">
                     {mover.serviceType.map((type) =>
                        isChipType(type) ? (
                           <MoveChip key={type} type={type} />
                        ) : null,
                     )}
                  </div>
                  <MoverProfile
                     big={true}
                     isLiked={isLiked}
                     handleLikedClick={handleLikedClick}
                     nickName={mover.nickName}
                     favoriteCount={mover.favoriteCount}
                     averageReviewRating={mover.averageReviewRating}
                     reviewCount={mover.reviewCount}
                     career={mover.career!}
                     estimateCount={mover.estimateCount}
                  />
               </div>
            ))}
         </div>
         <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
         />
      </>
   );
}
