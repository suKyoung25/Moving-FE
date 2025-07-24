import PageTitle from "@/components/layout/PageTitle";
import LineDivider from "@/components/common/LineDivider";
import EditButtons from "@/components/domain/dashboard/EditButtons";
import ReviewSection from "@/components/domain/dashboard/ReviewSection";
import MoverCard from "@/components/domain/dashboard/MoverCard";

const moverMock = {
   id: "mover1",
   profileImage: "http://www.zimssa.com/image-exmaple.png",
   nickName: "류제천짱",
   career: 2,
   introduction: "고객님의 물품을 소중하고 안전하게 운송하여 드립니다.",
   serviceType: ["SMALL", "HOME"],
   serviceArea: ["서울", "경기"],
   favoriteCount: 136,
   estimateCount: 334,
   averageReviewRating: 5.0,
   reviewCount: 178,
   isFavorite: true,
};

export default function MoverMyPage() {
   return (
      <div className="min-h-screen">
         <PageTitle title="마이페이지" />
         <LineDivider className="my-6" />
         <MoverCard mover={moverMock} />
         <div className="flex gap-2 max-lg:mt-2.5 max-md:flex-col lg:hidden">
            <EditButtons />
         </div>
         <LineDivider className="my-6 lg:mt-12 lg:mb-10" />
         <ReviewSection
            averageReviewRating={moverMock.averageReviewRating}
            reviewCount={moverMock.reviewCount}
         />
      </div>
   );
}
