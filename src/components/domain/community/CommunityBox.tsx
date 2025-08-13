"use client";

import { useRouter } from "next/navigation";
import Community from "./Community";
import CommunityButton from "./CommunityButton";
import SearchBox from "./SearchBox";
import { useGetAllCommunity } from "@/lib/api/community/query";
import Pagination from "@/components/common/Pagination";
import { useEffect, useState } from "react";
import { CommunityWithDetails } from "@/lib/types/community.types";

export default function CommunityBox() {
   const router = useRouter();
   const [page, setPage] = useState<number>(1);
   const [search, setSearch] = useState<string>("");
   const [debouncedSearch, setDebouncedSearch] = useState<string>("");
   const [isSearching, setIsSearching] = useState<boolean>(false);

   useEffect(() => {
      if (search !== debouncedSearch) {
         setIsSearching(true);
      }
      const timer = setTimeout(() => {
         setDebouncedSearch(search);
         setPage(1);
         setIsSearching(false);
      }, 500);

      return () => clearTimeout(timer);
   }, [search, debouncedSearch]);

   const {
      data: communityData,
      isLoading,
      isPending,
   } = useGetAllCommunity(page, debouncedSearch);

   if (isPending)
      return <div className="flex items-center justify-center">로딩중...</div>;

   console.log(communityData);

   return (
      <section>
         <CommunityButton address={"create"} text={"글쓰기"} />
         <SearchBox search={search} setSearch={setSearch} />

         {communityData?.data?.communities.length === 0 && (
            <div className="mt-10 text-center">검색 결과가 없습니다.</div>
         )}
         {communityData?.data?.communities.map((data: CommunityWithDetails) => (
            <span
               key={data.id}
               onClick={() => router.push(`/community/${data.id}`)}
               className={`block ${isSearching || isLoading ? "pointer-events-none opacity-50" : ""}`}
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
