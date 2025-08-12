"use client";

import { useRouter } from "next/navigation";
import Community from "./Community";
import CommunityButton from "./CommunityButton";
import SearchBox from "./SearchBox";

const mockData = [
   {
      id: "postId1",
      title: "커뮤니티 제목",
      content: "커뮤니티 게시글",
      createdAt: "2025-08-10T15:45:20.115Z",
      updatedAt: "2025-08-10T15:45:20.115Z",
      clientId: "35f079f7-658f-481a-b2b0-08acc86e45d4",
      moverId: "d25d6493-3845-4b71-becb-b09214028347",
      userNickname: "유지1",
      replies: [
         {
            id: "replyId1",
            content: "댓글1",
            createdAt: "2025-08-10T15:45:20.115Z",
            postId: "postId1",
            clientId: "clientId1",
            moverId: "moverId1",
         },
      ],
   },
   {
      id: "postId2",
      title: "커뮤니티 제목2",
      content: "커뮤니티 게시글2",
      createdAt: "2025-08-12T15:45:20.115Z",
      updatedAt: "2025-08-12T15:45:20.115Z",
      clientId: "35f079f7-658f-481a-b2b0-08acc86e45d4",
      moverId: "d25d6493-3845-4b71-becb-b09214028347",
      userNickname: "유지2",
      replies: [
         {
            id: "replyId1",
            content: "댓글1",
            createdAt: "2025-08-10T15:45:20.115Z",
            postId: "postId1",
            clientId: "clientId1",
            moverId: "moverId1",
         },
         {
            id: "replyId2",
            content: "댓글2",
            createdAt: "2025-08-12T15:45:20.115Z",
            postId: "postId2",
            clientId: "clientId2",
            moverId: "moverId2",
         },
      ],
   },
   {
      id: "postId3",
      title: "커뮤니티 제목3",
      content: "커뮤니티 게시글3",
      createdAt: "2025-08-10T15:45:20.115Z",
      updatedAt: "2025-08-10T15:45:20.115Z",
      clientId: "35f079f7-658f-481a-b2b0-08acc86e45d4",
      moverId: "d25d6493-3845-4b71-becb-b09214028347",
      userNickname: "유지3",
      replies: [
         {
            id: "replyId3",
            content: "댓글1",
            createdAt: "2025-08-10T15:45:20.115Z",
            postId: "postId1",
            clientId: "clientId1",
            moverId: "moverId1",
         },
      ],
   },
];

export default function CommunityBox() {
   const router = useRouter();
   return (
      <section>
         <CommunityButton address={"create"} text={"글쓰기"} />
         <SearchBox />
         {mockData.map((data) => (
            <span
               key={data.id}
               onClick={() => router.push(`/community/${data.id}`)}
            >
               <Community
                  title={data.title}
                  userNickname={data.userNickname}
                  date={data.createdAt}
                  content={data.content}
                  replyCount={data.replies.length}
               />
            </span>
         ))}
      </section>
   );
}
