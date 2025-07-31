"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SentQuotesList from "@/components/domain/my-quotes/SentQuotesList";
import RejectedRequestsList from "@/components/domain/my-quotes/RejectedRequestsList";

export default function Page() {
   const { user } = useAuth();
   const router = useRouter();
   const searchParams = useSearchParams();

   const tab = searchParams.get("tab");
   const activeTab = tab === "2" ? "2" : "1";

   useEffect(() => {
      if (!tab) {
         if (!user?.isProfileCompleted) {
            router.replace("/profile/create");
         } else {
            router.push("?tab=1");
         }
      }
   }, [tab, user, router]);

   if (activeTab === "1") {
      return <SentQuotesList />;
   } else if (activeTab === "2") {
      return <RejectedRequestsList />;
   }

   return null;
}

// 추후 아래 해당 코드로 리팩토링 예정
// import { redirect } from "next/navigation";
// export default async function Page({
//    searchParams,
// }: {
//    searchParams: Promise<{ tab: string }>;
// }) {
//    const { tab } = await searchParams;

//    if (!tab) {
//       redirect("?tab=1");
//    }
//    return (
//       <>
//          {tab === "1" ? (
//             <SentQuotesTab tab={tab} />
//          ) : (
//             <RejectedRequestsTab tab={tab} />
//          )}
//       </>
//    );
// }
