import CommunityBox from "@/components/domain/community/CommunityBox";
import PageTitle from "@/components/layout/PageTitle";
import { getTranslations } from "next-intl/server";

export default async function CommunityPage() {
   const t = await getTranslations("Community");
   return (
      <div>
         <PageTitle title={t("title")} />
         <CommunityBox />
      </div>
   );
}
