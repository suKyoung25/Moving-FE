<<<<<<< HEAD
export default function Page() {
   return <>Page</>;
=======

import RejectedRequestsTab from "@/components/domain/my-quotes/RejectedRequestsTab";
import SentQuotesTab from "@/components/domain/my-quotes/SentQuotesTab";
import { redirect } from "next/navigation";
export default async function Page({
   searchParams,
}: {
   searchParams: Promise<{ tab: string }>;
}) {
   const { tab } = await searchParams;

   if (!tab) {
      redirect("?tab=1");
   }

   return (
      <>
         {tab === "1" ? (
            <SentQuotesTab tab={tab} />
         ) : (
            <RejectedRequestsTab tab={tab} />
         )}
      </>
   );
>>>>>>> 559b5f421498632aef4ac725f509f42bb6a57a6f
}
