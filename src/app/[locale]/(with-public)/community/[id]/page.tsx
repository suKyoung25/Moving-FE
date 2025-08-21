import CommentInput from "@/components/domain/community/CommentInput";
import ProfileBox from "@/components/domain/community/ProfileBox";
import ReplyBox from "@/components/domain/community/ReplyBox";
import CommunityTitle from "@/components/domain/community/CommunityTitle";
import CommunityIndex from "@/components/domain/community/CommunityIndex";
import getCommunity from "@/lib/api/community/requests/getCommunity";
import { getTranslations } from "next-intl/server";
import LineDivider from "@/components/common/LineDivider";

export default async function CommunityDetailPage({
   params,
}: {
   params: Promise<{ id: string; locale: string }>;
}) {
   const t = await getTranslations("Community");
   const { id, locale } = await params;
   const { data } = await getCommunity(id, locale);
   const authorId = data.clientId || data.moverId;

   return (
      <div
         role="main"
         aria-labelledby="community-detail-title"
         className="min-h-screen"
      >
         <CommunityIndex index={t("communityDetail")} />
         <section className="mt-6" aria-labelledby="community-content-title">
            <CommunityTitle
               title={data.title}
               authorId={authorId}
               communityId={data.id}
            />
            <ProfileBox
               userNickname={data.userNickname}
               date={data.createdAt}
               profileImg={data.profileImg}
               isDetail={true}
            />
            <LineDivider className="mt-4 mb-6" />
            <p
               className="text-14-medium md:text-16-medium mb-15 whitespace-pre-wrap"
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
