"use client";

import React, { useState } from "react";
import WritableReviews from "./WritableReviews";
import MyReviews from "./MyReviews";

export default function ReviewTabs() {
  const [activeTab, setActiveTab] = useState<"writable" | "my">("writable");

  return (
    <div>
      {/* 탭 헤더 */}
      <div className="flex gap-6 lg:gap-10 border-b border-line-100 w-full">
        {/* 작성 가능한 리뷰 탭 */}
        <button
          className={`pb-4 lg:pb-8 text-14-bold lg:text-24-semibold ${
            activeTab === "writable"
              ? "text-black-400 border-b-2 lg:border-b-4 border-primary-blue-400"
              : "text-gray-400"
          } relative`}
          onClick={() => setActiveTab("writable")}
        >
          작성 가능한 리뷰
        </button>
        {/* 내가 작성한 리뷰 탭 */}
        <button
          className={`pb-4 lg:pb-8 text-14-bold lg:text-24-semibold ${
            activeTab === "my"
              ? "text-black-400 border-b-2 lg:border-b-4 border-primary-blue-400"
              : "text-gray-400"
          } relative`}
          onClick={() => setActiveTab("my")}
        >
          내가 작성한 리뷰
        </button>
      </div>
      {/* 탭 내용 */}
      <div className="pt-10">
        {activeTab === "writable" ? (
          <div>
            <WritableReviews />
          </div>
        ) : (
          <div>
            <MyReviews setActiveTab={setActiveTab} />
          </div>
        )}
      </div>
    </div>
  );
}
