"use client";

import Pending from "@/components/my-quotes/pages/Pending";
import Received from "@/components/my-quotes/pages/Received";
import { useSearchParams } from "next/navigation";

export default function MyQuotes() {
   const searchParams = useSearchParams();
   const path = searchParams.get("path");
   console.log(path);
   if (path === "pending") {
      return <Pending />;
   } else if (path === "received") {
      return <Received />;
   }

   return null;
}
