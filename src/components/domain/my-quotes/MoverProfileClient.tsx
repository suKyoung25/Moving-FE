"use client";

import profile from "@/assets/images/profileIcon.svg";
import MoveChip, { ChipType } from "@/components/common/MoveChip";
import MoverProfile from "@/components/common/MoverProfile";

interface MoverProfileclientProps {
   moveType: ChipType | null;
   isDesignated: boolean;
   moverName: string;
   profileImage: string | null;
   isFavorited: boolean;
   handleLikedClick?: () => void;
   averageReviewRating: number;
   reviewCount: number;
   career: number;
   estimateCount: number;
   favoriteCount: number;
   quotesStatus: "pending" | "received";
   comment?: string;
}

export default function MoverProfileclient(props: MoverProfileclientProps) {
   return (
      <article className="flex flex-col gap-3.5">
         <div className="flex items-center gap-2">
            {props.quotesStatus === "pending" && <MoveChip type="PENDING" />}
            {props.moveType && <MoveChip type={props.moveType as ChipType} />}
            {props.isDesignated && <MoveChip type="DESIGNATED" />}
         </div>
         <p
            className={`text-14-semibold text-black-300 lg:text-20-semibold ${props.quotesStatus === "pending" ? "hidden" : "block"}`}
         >
            {props.comment}
         </p>
         <MoverProfile
            nickName={props.moverName}
            profileImage={props.profileImage || profile}
            isLiked={!!props.isFavorited}
            handleLikedClick={() => console.log("찜 토글")}
            averageReviewRating={props.averageReviewRating}
            reviewCount={props.reviewCount}
            career={props.career | 0}
            estimateCount={props.estimateCount}
            favoriteCount={props.favoriteCount}
         />
      </article>
   );
}
