"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function ReviewTabs() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const activeTab = searchParams.get("tab") === "my" ? "my" : "writable";

   const handleTab = (tab: "writable" | "my") => {
      router.replace(`?tab=${tab}`);
   };

   return (
      <div className="relative flex gap-6 lg:gap-10">
         <div className="flex items-center">
            <button
               className={`text-14-bold lg:text-24-semibold py-4 lg:py-8 ${
                  activeTab === "writable"
                     ? "text-black-400 border-primary-blue-400 border-b-4"
                     : "text-gray-400"
               }`}
               onClick={() => handleTab("writable")}
            >
               작성 가능한 리뷰
            </button>
         </div>
         <div className="flex items-center">
            <button
               className={`text-14-bold lg:text-24-semibold py-4 lg:py-8 ${
                  activeTab === "my"
                     ? "text-black-400 border-primary-blue-400 border-b-4"
                     : "text-gray-400"
               }`}
               onClick={() => handleTab("my")}
            >
               내가 작성한 리뷰
            </button>
         </div>
      </div>
   );
}
