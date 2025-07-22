import PageTitle from "@/components/layout/PageTitle";
import FavoriteMover from "@/components/domain/favorite-movers/FavoriteMover";

// 내가 찜한 기사님
export default function FavoriteMoverPage() {
   return (
      <div>
         <PageTitle title="찜한 기사님" />
         <div className="pt-6">
            <FavoriteMover />
         </div>
      </div>
   );
}
