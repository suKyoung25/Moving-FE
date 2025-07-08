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
    <div className="flex gap-6 lg:gap-10 w-full relative">
      <div className="flex-1 relative flex flex-col items-center">
        <button
          className={`text-14-bold lg:text-24-semibold ${
            activeTab === "writable" ? "text-black-400" : "text-gray-400"
          }`}
          onClick={() => handleTab("writable")}
        >
          작성 가능한 리뷰
        </button>
        {activeTab === "writable" && (
          <div className="absolute left-0 right-0 top-8.5 lg:top-11 h-0.5 lg:h-1 bg-primary-blue-400 rounded"></div>
        )}
      </div>
      <div className="flex-1 relative flex flex-col items-center">
        <button
          className={`text-14-bold lg:text-24-semibold ${
            activeTab === "my" ? "text-black-400" : "text-gray-400"
          }`}
          onClick={() => handleTab("my")}
        >
          내가 작성한 리뷰
        </button>
        {activeTab === "my" && (
          <div className="absolute left-0 right-0 top-8.5 lg:top-11 h-0.5 lg:h-1 bg-primary-blue-400 rounded"></div>
        )}
      </div>
    </div>
  );
}
