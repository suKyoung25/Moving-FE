import EmptyState from "@/components/common/EmptyState";
import { getSentEstimates } from "@/lib/api/estimate/requests/getSentEstimates";
import QuoteCard from "./QuoteCard";

export default async function SentQuotesList() {
   const estimate = await getSentEstimates();

   const hasEstimates = estimate?.data?.length > 0;

   return (
      <div>
         {hasEstimates ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
               {estimate.data.map((est: any) => (
                  <QuoteCard key={est.id} estimate={est} />
               ))}
            </div>
         ) : (
            <div>
               <EmptyState message="아직 보낸 견적이 없습니다." />
            </div>
         )}
      </div>
   );
}
