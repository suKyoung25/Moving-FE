import Image from "next/image";
import React from "react";
import yellowStar from "@/assets/images/starFilledIcon.svg";
import grayStar from "@/assets/images/starOutlineIcon.svg";

export default function ReviewStar({
   rating,
   size = "h-6 w-6 lg:h-12 lg:w-12",
}: {
   rating: number;
   size?: string;
}) {
   return (
      <div className="flex">
         {[1, 2, 3, 4, 5].map((idx) => {
            let src;
            if (rating >= idx) {
               src = yellowStar;
            } else {
               src = grayStar;
            }
            return (
               <Image
                  key={idx}
                  src={src}
                  alt={yellowStar ? "노란별" : "회색별"}
                  className={size}
               />
            );
         })}
      </div>
   );
}
