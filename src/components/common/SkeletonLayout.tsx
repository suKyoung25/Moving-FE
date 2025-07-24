import React from "react";

interface SkeletonLayoutProps {
   count: number;
   SkeletonComponent: React.FC;
}
export default function SkeletonLayout({
   count,
   SkeletonComponent,
}: SkeletonLayoutProps) {
   return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
         {Array.from({ length: count }).map((_, index) => (
            <SkeletonComponent key={index} />
         ))}
      </div>
   );
}
