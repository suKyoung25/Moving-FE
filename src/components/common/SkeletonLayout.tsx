"use client";

interface SkeletonLayoutProps {
   count: number;
   SkeletonComponent: React.FC;
}
export default function SkeletonLayout({
   count,
   SkeletonComponent,
}: SkeletonLayoutProps) {
   return (
      <>
         {Array.from({ length: count }).map((_, index) => (
            <SkeletonComponent key={index} />
         ))}
      </>
   );
}
