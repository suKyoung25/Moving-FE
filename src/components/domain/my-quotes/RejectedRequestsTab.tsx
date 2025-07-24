import { Suspense } from "react";
import RejectedRequestsList from "./RejectedRequestsList";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import RejectedRequestsSkeleton from "@/components/domain/my-quotes/RejectedRequestsSkeleton";

export default function RejectedRequestsTab({ tab }: { tab: string }) {
   return (
      <Suspense
         key={tab}
         fallback={
            <SkeletonLayout
               count={6}
               SkeletonComponent={RejectedRequestsSkeleton}
            />
         }
      >
         <RejectedRequestsList />
      </Suspense>
   );
}
