"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TabButtons() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const currentTab = searchParams.get("tab");

   const handleTabChange = (tab: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", tab);
      router.push(`?${params.toString()}`);
   };

   return (
      <div>
         <button
            onClick={() => handleTabChange("sent")}
            className={currentTab === "sent" ? "font-bold" : ""}
         >
            보낸 견적 조회
         </button>
         <button
            onClick={() => handleTabChange("rejected")}
            className={currentTab === "rejected" ? "font-bold" : ""}
         >
            반려 요청
         </button>
      </div>
   );
}
