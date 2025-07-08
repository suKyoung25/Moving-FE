"use client";

import { useMyQuotes } from "@/context/MyQuotesContext";

export default function MyQuotesLayout() {
  const { activeTab, setActiveTab } = useMyQuotes();

  return (
    <div className="mb-[-12px] h-13.5 flex items-center gap-6">
      <p
        onClick={() => setActiveTab("pending")}
        className={`h-full leading-13.5 cursor-pointer ${activeTab === "pending" ? "text-14-bold border-b-2 border-black-400" : "text-14-semibold text-gray-400"}`}
      >
        대기중인 견적
      </p>
      <p
        onClick={() => setActiveTab("received")}
        className={`h-full leading-13.5 cursor-pointer ${activeTab === "received" ? "text-14-bold border-b-2 border-black-400" : "text-14-semibold text-gray-400"}`}
      >
        받았던 견적
      </p>
    </div>
  );
}
