import EmptyState from "@/components/common/states/EmptyState";
import MoverEstimateCard from "@/components/my-quotes/MoverEstimateCard";
import { getRejectedEstimates } from "@/lib/api/my-quotes/getRejectedEstimates";
import { getSentEstimates } from "@/lib/api/my-quotes/getSentEstimates";
import { Estimate } from "@/lib/types";
import { redirect } from "next/navigation";

// 내 견적 관리
export default async function Page({
   searchParams,
}: {
   searchParams: Promise<{ tab: string }>;
}) {
   const { tab } = await searchParams;

   if (!tab) {
      redirect("?tab=sent");
   }

   const { data: estimatesRaw } =
      tab === "rejected"
         ? await getRejectedEstimates()
         : await getSentEstimates();

   const estimates = estimatesRaw.sort(
      (a: Estimate, b: Estimate) =>
         new Date(b.request.moveDate).getTime() -
         new Date(a.request.moveDate).getTime(),
   );

   return (
      <div>
         {estimates.length === 0 ? (
            <EmptyState
               message={`${tab === "sent" ? "아직 보낸 견적이 없습니다." : "아직 반려한 견적이 없습니다."}`}
            />
         ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-12">
               {estimates.map((estimate: Estimate) => (
                  <MoverEstimateCard key={estimate.id} {...estimate} />
               ))}
            </div>
         )}
      </div>
   );
}
