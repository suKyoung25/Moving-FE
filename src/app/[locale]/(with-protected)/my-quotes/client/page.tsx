import ActiveRequest from "@/components/domain/my-quotes/ActiveRequest";
import Pending from "@/components/domain/my-quotes/Pending";
import Received from "@/components/domain/my-quotes/Received";
import Requested from "@/components/domain/my-quotes/Requested";

type PageProps = {
   searchParams: Promise<{ tab?: string }>;
};

// 내 견적 관리
export default async function Page({ searchParams }: PageProps) {
   const { tab } = await searchParams;
   const activeTab = tab === "3" ? "3" : tab === "2" ? "2" : "1";

   if (activeTab === "1") {
      return (
         <>
            <ActiveRequest />
            <div className="px-6 py-6 md:px-16 md:py-8 lg:mx-auto lg:max-w-350 lg:px-0">
               <Pending />
            </div>
         </>
      );
   } else if (activeTab === "2") {
      return (
         <div className="px-6 py-6 md:px-16 md:py-8 lg:mx-auto lg:max-w-350 lg:px-0">
            <Received />
         </div>
      );
   } else if (activeTab === "3") {
      return (
         <div className="px-6 py-6 md:px-16 md:py-8 lg:mx-auto lg:max-w-350 lg:px-0">
            <Requested />
         </div>
      );
   }
}
