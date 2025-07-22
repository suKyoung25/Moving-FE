// 리뷰 작성
import MyReviews from "@/components/domain/reviews/MyReviews";
import WritableReviews from "@/components/domain/reviews/WritableReviews";

type PageProps = {
   searchParams: Promise<{ tab?: string }>;
};

export default async function ReviewsPage({ searchParams }: PageProps) {
   const { tab } = await searchParams;
   const activeTab = tab === "my" ? "my" : "writable";

   return (
      <div className="pt-10">
         {activeTab === "writable" ? <WritableReviews /> : <MyReviews />}
      </div>
   );
}
