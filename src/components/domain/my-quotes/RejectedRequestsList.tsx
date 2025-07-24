import EmptyState from "@/components/common/EmptyState";
import { getRejectedEstimates } from "@/lib/api/estimate/requests/getRejectedEstimates";
import QuoteCard from "./QuoteCard";
import { MyEstimateDetail } from "@/lib/types";

export default async function RejectedRequestsList() {
   const estimate = await getRejectedEstimates();

   const hasEstimates = estimate?.data?.length > 0;

   return (
      <div>
         {hasEstimates ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
               {estimate.data.map((est: MyEstimateDetail) => (
                  <QuoteCard key={est.id} estimate={est} />
               ))}
            </div>
         ) : (
            <div>
               <EmptyState message="아직 반려한 견적이 없습니다." />
            </div>
         )}
      </div>
   );
}
