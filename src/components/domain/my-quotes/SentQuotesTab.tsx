import { Suspense } from "react";
import SentQuotesList from "./SentQuotesList";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import SentQuotesSkeleton from "@/components/domain/my-quotes/SentQuotesSkeleton";

export default function SentQuotesTab({ tab }: { tab: string }) {
   return (
      <Suspense
         key={tab}
         fallback={
            <SkeletonLayout count={6} SkeletonComponent={SentQuotesSkeleton} />
         }
      >
         <SentQuotesList />
      </Suspense>
   );
}
