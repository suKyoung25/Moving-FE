import Pending from "@/components/domain/my-quotes/Pending";
import Received from "@/components/domain/my-quotes/Received";

type PageProps = {
   searchParams: Promise<{ tab?: string }>;
};

// 내 견적 관리
export default async function Page({ searchParams }: PageProps) {
   const { tab } = await searchParams;
   const activeTab = tab === "2" ? "2" : "1";

   if (activeTab === "1") {
      return <Pending />;
   } else if (activeTab === "2") {
      return <Received />;
   }
}
