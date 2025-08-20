import PageTitle from "@/components/layout/PageTitle";
import CommentInput from "@/components/domain/community/CommentInput";
import ProfileBox from "@/components/domain/community/ProfileBox";
import ReplyBox from "@/components/domain/community/ReplyBox";
import getCommunity from "@/lib/api/community/getCommunity";
import CommunityTitle from "@/components/domain/community/CommunityTitle";
import { getTranslations } from "next-intl/server";

export default async function CommunityDetailPage({
   params,
}: {
   params: Promise<{ id: string; locale: string }>;
}) {
   const { id, locale } = await params;

   const t = await getTranslations("Community");

   const { data } = await getCommunity(id, locale);

   const authorId = data.clientId || data.moverId;

   return (
      <div
         role="main"
         aria-labelledby="community-detail-title"
         className="min-h-screen"
      >
         <h1 id="community-detail-title" className="sr-only">
            {t("communityDetailTitle")}
         </h1>
         <p className="sr-only">{t("communityDetailDescription")}</p>

         <PageTitle title={t("communityDetail")} />
         <section
            className="mt-5 rounded-2xl px-3.5 py-4 shadow lg:px-6 lg:py-5"
            aria-labelledby="community-content-title"
         >
            <h2 id="community-content-title" className="sr-only">
               {t("communityContentTitle")}
            </h2>

            <CommunityTitle
               title={data.title}
               authorId={authorId}
               communityId={data.id}
            />
            <ProfileBox
               userNickname={data.userNickname}
               date={data.createdAt}
               profileImg={data.profileImg}
               isreply={false}
            />
            <p
               className="text-14-medium md:text-16-medium mt-5 whitespace-pre-wrap"
               aria-label={t("communityContentAria", { title: data.title })}
            >
               {data.content}
            </p>
            <CommentInput id={id} count={data.replyCount} />
            <ReplyBox community={id} communityAuthorId={authorId} />
         </section>
      </div>
   );
}
