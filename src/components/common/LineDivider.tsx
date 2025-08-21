import React from "react";

const verticalClass = "mx-[9.5px] flex h-[14px] w-[1.5px] flex-col";

export default function LineDivider({
   className,
   isVertical,
}: {
   className?: string;
   isVertical?: boolean;
}) {
   return (
      <span
         className={`bg-line-200 border-line-100 flex border-b-1 ${className} ${isVertical && verticalClass}`}
      ></span>
   );
}
