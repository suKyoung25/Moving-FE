"use client";

import { useRouter } from "next/navigation";
import Community from "./Community";
import CommunityButton from "./CommunityButton";
import SearchBox from "./SearchBox";
import { useGetAllCommunity } from "@/lib/api/community/query";
import Pagination from "@/components/common/Pagination";
import { useState } from "react";
import { CommunityWithDetails } from "@/lib/types/community.types";

export default function CommunityBox() {
   const router = useRouter();
   const [page, setPage] = useState<number>(1);

   const { data: communityData, isPending } = useGetAllCommunity(page);

   if (isPending) return <div>로딩중...</div>;

   return (
      <section>
         <CommunityButton address={"create"} text={"글쓰기"} />
         <SearchBox />
         {communityData.data.communities.map((data: CommunityWithDetails) => (
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
                  profileImg={data.profileImg}
               />
            </span>
         ))}
         <Pagination
            page={page}
            totalPages={communityData.data.totalPages}
            onPageChange={setPage}
         />
      </section>
   );
}
