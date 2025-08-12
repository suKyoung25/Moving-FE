import PageTitle from "@/components/layout/PageTitle";
import CommentInput from "@/components/domain/community/CommentInput";
import ProfileBox from "@/components/domain/community/ProfileBox";
import ReplyBox from "@/components/domain/community/ReplyBox";
import getCommunity from "@/lib/api/community/getCommunity";

export default async function page({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = await params;

   const { data } = await getCommunity(id);

   return (
      <div>
         <PageTitle title="커뮤니티 상세" />
         <section className="mt-5 rounded-2xl px-3.5 py-4 shadow-[0_-2px_10px_rgba(220,220,220,0.2),_0_2px_10px_rgba(220,220,220,0.14)]">
            <p className="text-18-semibold md:text-24-semibold">
               원인 및 해결방안이 궁금합니다.
            </p>
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
            <ReplyBox community={id} />
         </section>
      </div>
   );
}
