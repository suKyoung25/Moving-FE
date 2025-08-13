import PageTitle from "@/components/layout/PageTitle";
import CommentInput from "@/components/domain/community/CommentInput";
import ProfileBox from "@/components/domain/community/ProfileBox";
import ReplyBox from "@/components/domain/community/ReplyBox";
import getCommunity from "@/lib/api/community/getCommunity";
import CommunityTitle from "@/components/domain/community/CommunityTitle";

export default async function page({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = await params;

   const { data } = await getCommunity(id);

   const authorId = data.clientId || data.moverId;

   return (
      <div>
         <PageTitle title="커뮤니티 상세" />
         <section className="mt-5 rounded-2xl px-3.5 py-4 shadow-[0_-2px_10px_rgba(220,220,220,0.2),_0_2px_10px_rgba(220,220,220,0.14)]">
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
            <p className="text-14-medium md:text-16-medium mt-5 whitespace-pre-wrap">
               {data.content}
            </p>
            <CommentInput id={id} count={data.replyCount} />
            <ReplyBox community={id} communityAuthorId={authorId} />
         </section>
      </div>
   );
}
