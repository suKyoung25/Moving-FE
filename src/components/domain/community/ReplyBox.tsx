"use client";

import Image from "next/image";
import profile from "@/assets/images/profileIcon.svg";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useGetReplies } from "@/lib/api/community/query";
import { ReplyWithDetails } from "@/lib/types/community.types";
import ReplyNicknameBox from "./ReplyNicknameBox";

export default function ReplyBox({
   community,
   communityAuthorId,
}: {
   community: string;
   communityAuthorId: string;
}) {
   const { data, isPending } = useGetReplies(community);

   if (isPending && !data) return <div>로딩중...</div>;

   const replies = data || [];

   return (
      <>
         {replies.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
               아직 댓글이 없습니다.
            </div>
         ) : (
            replies.map((reply: ReplyWithDetails) => (
               <div key={reply.id} className="mt-10">
                  <div className="flex items-center gap-2">
                     <div className="h-9 w-9 overflow-hidden rounded-full">
                        <Image
                           alt="프로필 이미지"
                           src={reply.profileImg || profile}
                           width={200}
                           height={200}
                           className="object-cover"
                        />
                     </div>
                     <ReplyNicknameBox
                        userNickname={reply.userNickname}
                        authorId={reply.clientId || reply.moverId}
                        replyId={reply.id}
                        communityAuthorId={communityAuthorId}
                     />
                  </div>
                  <p className="text-14-medium md:text-16-medium mt-4 pl-11 whitespace-pre-wrap">
                     {reply.content}
                  </p>
                  <p className="text-14-regular mt-3 pl-11 text-gray-200">
                     {formatDistanceToNow(new Date(reply.createdAt), {
                        addSuffix: true,
                        locale: ko,
                     })}
                  </p>
               </div>
            ))
         )}
      </>
   );
}
