"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

type TabType = 1 | 2;

type TabsProps = {
   tab1Label: string;
   tab2Label: string;
};

export default function HeaderTabs({
   tab1Label = "작성 가능한 리뷰",
   tab2Label = "내가 작성한 리뷰",
}: TabsProps) {
   const router = useRouter();
   const searchParams = useSearchParams();
   // 쿼리스트링에 숫자 저장, 기본값 1
   const activeTab = Number(searchParams.get("tab")) === 2 ? 2 : 1;

   const handleTab = (tab: TabType) => {
      router.replace(`?tab=${tab}`);
   };

   return (
      <div className="relative flex gap-6 lg:gap-8">
         <div className="flex items-center">
            <button
               className={`text-14-bold md:text-16-bold py-3 lg:py-4 ${
                  activeTab === 1
                     ? "text-black-400 border-primary-blue-400 border-b-3"
                     : "text-gray-400"
               }`}
               onClick={() => handleTab(1)}
            >
               {tab1Label}
            </button>
         </div>
         <div className="flex items-center">
            <button
               className={`text-14-bold md:text-16-bold py-3 lg:py-4 ${
                  activeTab === 2
                     ? "text-black-400 border-primary-blue-400 border-b-3"
                     : "text-gray-400"
               }`}
               onClick={() => handleTab(2)}
            >
               {tab2Label}
            </button>
         </div>
      </div>
   );
}
