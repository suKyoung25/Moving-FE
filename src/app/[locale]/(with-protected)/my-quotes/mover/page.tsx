import RejectedRequestsTab from "@/components/domain/my-quotes/RejectedRequestsTab";
import SentQuotesTab from "@/components/domain/my-quotes/SentQuotesTab";

type PageProps = {
   searchParams: Promise<{ tab?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
   const { tab } = await searchParams;
   const activeTab = tab === "2" ? "2" : "1";

   if (activeTab === "1") {
      return <SentQuotesTab tab={activeTab} />;
   } else if (activeTab === "2") {
      return <RejectedRequestsTab tab={activeTab} />;
   }
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
