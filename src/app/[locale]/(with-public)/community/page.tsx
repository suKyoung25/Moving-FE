import CommunityBox from "@/components/domain/community/CommunityBox";
import CommunityButton from "@/components/domain/community/CommunityButton";
import CommunityIndex from "@/components/domain/community/CommunityIndex";
import { getTranslations } from "next-intl/server";

export default async function CommunityPage() {
   const t = await getTranslations("Community");

   return (
      <>
         <div className="flex items-start justify-between">
            <CommunityIndex index={t("pageTitle")} />
            <CommunityButton address={"create"} text={t("writePost")} />
         </div>
         <CommunityBox />
      </>
   );
}
