import React from "react";

const verticalClass = "mx-[9.5px] flex h-[14px] w-0.5 flex-col";

export default function LineDivider({
   className,
   isVertical,
}: {
   className?: string;
   isVertical?: boolean;
}) {
   return (
      <span
         className={`bg-line-200 border-line-100 flex border ${className} ${isVertical && verticalClass}`}
      ></span>
   );
}
