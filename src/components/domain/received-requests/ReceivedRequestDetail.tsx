import SocialShareGroup from "@/components/common/SocialShareGroup";
import PageTitle from "@/components/layout/PageTitle";
import { Suspense } from "react";
import ReceivedRequestDetailContent from "./ReceivedRequestDetailContent";
import { getTranslations } from "next-intl/server";
import Spinner from "@/components/common/Spinner";

export default async function ReceivedRequestDetail({
   id,
   locale,
}: {
   id: string;
   locale: string;
}) {
   const t = await getTranslations("ReceivedRequests.Detail");

   return (
      <div>
         <PageTitle title={t("pageTitle")} />
         <div className="mt-4 lg:flex lg:gap-40">
            <article className="flex flex-col gap-6 lg:flex-1 lg:gap-10">
               <Suspense fallback={<Spinner />}>
                  <ReceivedRequestDetailContent id={id} locale={locale} />
               </Suspense>
            </article>
            <article className="hidden h-fit w-60 lg:block">
               <SocialShareGroup text={t("shareQuoteText")} />
            </article>
         </div>
      </div>
   );
}
