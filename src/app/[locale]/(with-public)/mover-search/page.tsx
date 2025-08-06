import PageTitle from "@/components/layout/PageTitle";
import FindDriverLayout from "@/components/domain/mover-search/FindDriverLayout";
import { getTranslations } from "next-intl/server";

export default async function FindDriverPage() {
   const t = await getTranslations("MoverSearch");

   return (
      <div>
         <PageTitle title={t("findDriver")} />
         <FindDriverLayout />
      </div>
   );
}
