import PageTitle from "@/components/layout/PageTitle";
import FavoriteMover from "@/components/domain/favorite-movers/FavoriteMover";
import { getTranslations } from "next-intl/server";

// 내가 찜한 기사님
export default async function FavoriteMoverPage() {
   const t = await getTranslations("FavoriteMovers");

   return (
      <div
         role="main"
         aria-labelledby="favorite-movers-page-title"
         className="min-h-screen"
      >
         <h1 id="favorite-movers-page-title" className="sr-only">
            {t("pageTitle")}
         </h1>
         <p className="sr-only">{t("pageDescription")}</p>
         <PageTitle title={t("title")} />
         <div className="pt-6">
            <FavoriteMover />
         </div>
      </div>
   );
}
