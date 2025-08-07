import PageTitle from "@/components/layout/PageTitle";
import MoverSearchLayout from "@/components/domain/mover-search/MoverSearchLayout";
import { getTranslations } from "next-intl/server";

export default async function MoverSearchPage() {
   const t = await getTranslations("MoverSearch");

   return (
      <div>
         <PageTitle title={t("findDriver")} />
         <MoverSearchLayout />
      </div>
   );
}
