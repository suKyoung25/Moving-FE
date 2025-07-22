"use client";

import { useRouter, useSearchParams } from "next/navigation";

// 서브 헤더
export default function MyQuotesLayout() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const path = searchParams.get("path");

   return (
      <div className="-mb-3 flex h-13.5 items-center gap-6">
         <p
            onClick={() => router.push("/my-quotes/client?path=pending")}
            className={`h-full cursor-pointer leading-13.5 ${path === "pending" ? "text-14-bold border-black-400 border-b-2" : "text-14-semibold text-gray-400"}`}
         >
            대기중인 견적
         </p>
         <p
            onClick={() => router.push("/my-quotes/client?path=received")}
            className={`h-full cursor-pointer leading-13.5 ${path === "received" ? "text-14-bold border-black-400 border-b-2" : "text-14-semibold text-gray-400"}`}
         >
            받았던 견적
         </p>
      </div>
   );
}
