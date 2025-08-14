"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

type TabType = 1 | 2 | 3;

type TabsProps = {
   tab1Label: string;
   tab2Label: string;
   tab3Label?: string;
};

export default function HeaderTabs({
   tab1Label = "탭1",
   tab2Label = "탭2",
   tab3Label,
}: TabsProps) {
   const router = useRouter();
   const searchParams = useSearchParams();

   // 값이 있는 탭만 배열로 구성
   const tabs = [tab1Label, tab2Label, tab3Label].filter(
      (label): label is string => Boolean(label),
   );

   // 현재 활성 탭 계산 (없으면 첫 번째)
   const tabParam = Number(searchParams.get("tab"));
   const activeTab = tabParam >= 1 && tabParam <= tabs.length ? tabParam : 1;

   const handleTab = useCallback(
      (tab: TabType) => {
         router.replace(`?tab=${tab}`);
      },
      [router],
   );

   // 키보드 네비게이션 핸들링
   const handleKeyDown = (
      e: React.KeyboardEvent<HTMLButtonElement>,
      currentTab: TabType,
   ) => {
      if (e.key === "ArrowRight") {
         e.preventDefault();
         handleTab(((currentTab % 3) + 1) as TabType);
      } else if (e.key === "ArrowLeft") {
         e.preventDefault();
         handleTab(((currentTab + 1) % 3 || 3) as TabType);
      }
   };

   return (
      <div
         className="relative flex gap-6 lg:gap-8"
         role="tablist"
         aria-label="탭 목록"
      >
         {[tab1Label, tab2Label, tab3Label].map((label, i) => {
            const tabNumber = (i + 1) as TabType;
            const isActive = activeTab === tabNumber;
            const tabId = `tab-${tabNumber}`;
            const panelId = `tabpanel-${tabNumber}`;
            return (
               <div className="flex items-center" key={tabId}>
                  <button
                     id={tabId}
                     role="tab"
                     aria-selected={isActive}
                     aria-controls={panelId}
                     tabIndex={isActive ? 0 : -1}
                     className={`text-14-bold md:text-16-bold py-3 focus:ring-0 focus:outline-none lg:py-4 ${
                        isActive
                           ? "text-black-400 border-primary-blue-400 border-b-3"
                           : "text-gray-400"
                     }`}
                     onClick={() => handleTab(tabNumber)}
                     onKeyDown={(e) => handleKeyDown(e, tabNumber)}
                  >
                     {label}
                  </button>
               </div>
            );
         })}
      </div>
   );
}
