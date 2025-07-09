"use client";

import MoverProfileclient from "./MoverProfileClient";

export default function ReceivedCard() {
  return (
    <div
      style={{
        boxShadow:
          "-2px -2px 10px rgba(220, 220, 220, 0.2), 2px 2px 10px rgba(220, 220, 220, 0.14)",
      }}
      className="bg-white px-3.5 lg:px-6 pt-5 lg:pt-7 pb-3.5 lg:pb-5.5 w-full flex flex-col gap-2 rounded-2xl cursor-pointer"
    >
      <MoverProfileclient />
      <div className="flex items-center justify-end gap-2">
        <p className="text-14-medium lg:text-18-medium">견적금액</p>
        <p className="text-18-bold lg:text-24-bold">180,000원</p>
      </div>
    </div>
  );
}
