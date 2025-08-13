// NotificationSkeleton.tsx
"use client";

export default function NotificationSkeleton() {
   return (
      <div
         className="hover:bg-hover-100 border-b-line-200 flex w-full animate-pulse flex-col items-baseline gap-1 rounded-lg border-b-1 px-4 py-3 text-left lg:px-6 lg:py-4"
         role="listitem"
      >
         {/* 본문 자리 */}
         <div className="bg-primary-blue-200 h-4 w-3/4 rounded" />
         {/* 날짜 자리 */}
         <div className="h-3 w-20 rounded bg-gray-100 lg:h-3.5" />
      </div>
   );
}
