import PageTitle from "@/components/layout/PageTitle";
import LineDivider from "@/components/common/LineDivider";
import EditButtons from "@/components/domain/dashboard/EditButtons";
import ReviewSection from "@/components/domain/dashboard/ReviewSection";
import MoverCard from "@/components/domain/dashboard/MoverCard";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

// 로딩 컴포넌트들
const MoverCardSkeleton = () => (
   <section className="bg-bg-100 flex flex-col gap-4 rounded-2xl border border-gray-100 px-4 py-[14px] lg:p-6">
      <div className="animate-pulse">
         <div className="mb-4 flex items-center gap-4 lg:justify-between">
            <div className="h-16 w-16 rounded-full bg-gray-200 lg:hidden"></div>
            <div className="flex-1">
               <div className="mb-2 h-6 rounded bg-gray-200"></div>
               <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            </div>
         </div>
         <div className="mb-4 h-24 rounded bg-gray-200"></div>
      </div>
   </section>
);

const ReviewSectionSkeleton = () => (
   <section>
      <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
      <div className="mt-8 h-64 animate-pulse rounded-lg bg-gray-200"></div>
   </section>
);

export default async function MoverMyPage() {
   const t = await getTranslations("Dashboard");

   return (
      <div className="min-h-screen">
         <PageTitle title={t("title")} />
         <LineDivider className="my-6" />

         {/* MoverCard를 Suspense로 감싸서 병렬 로딩 */}
         <Suspense fallback={<MoverCardSkeleton />}>
            <MoverCard />
         </Suspense>

         <div className="flex gap-2 max-lg:mt-2.5 max-md:flex-col lg:hidden">
            <EditButtons />
         </div>

         <LineDivider className="my-6 lg:mt-12 lg:mb-10" />

         {/* ReviewSection을 Suspense로 감싸서 병렬 로딩 */}
         <Suspense fallback={<ReviewSectionSkeleton />}>
            <ReviewSection />
         </Suspense>
      </div>
   );
}
