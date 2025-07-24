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
>>>>>>> 81d22fa89286e4d8d7a6d771417cad7f7e78c781
}
