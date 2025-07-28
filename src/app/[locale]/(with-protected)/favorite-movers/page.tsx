import PageTitle from "@/components/layout/PageTitle";
import FavoriteMover from "@/components/domain/favorite-movers/FavoriteMover";
import { getTranslations } from "next-intl/server";

// 내가 찜한 기사님
export default async function FavoriteMoverPage() {
   const t = await getTranslations("FavoriteMovers");
   return (
      <div>
         <PageTitle title={t("title")} />
         <div className="pt-6">
            <FavoriteMover />
         </div>
      </div>
   );
}
