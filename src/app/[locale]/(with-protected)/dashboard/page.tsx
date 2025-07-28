import PageTitle from "@/components/layout/PageTitle";
import LineDivider from "@/components/common/LineDivider";
import EditButtons from "@/components/domain/dashboard/EditButtons";
import ReviewSection from "@/components/domain/dashboard/ReviewSection";
import MoverCard from "@/components/domain/dashboard/MoverCard";


export default function MoverMyPage() {
   return (
      <div className="min-h-screen">
         <PageTitle title="마이페이지" />
         <LineDivider className="my-6" />
         <MoverCard />
         <div className="flex gap-2 max-lg:mt-2.5 max-md:flex-col lg:hidden">
            <EditButtons />
         </div>
         <LineDivider className="my-6 lg:mt-12 lg:mb-10" />
         <ReviewSection/>
      </div>
   );
}
