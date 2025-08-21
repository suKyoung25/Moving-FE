"use client";

import Community from "./Community";
import SearchBox from "./SearchBox";
import Pagination from "@/components/common/Pagination";
import CommunitySkeleton from "./CommunitySkeleton";
import SkeletonLayout from "@/components/common/SkeletonLayout";
import Link from "next/link";
import { useGetAllCommunity } from "@/lib/api/community/query";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CommunityWithDetails } from "@/lib/types";

export default function CommunityBox() {
   const t = useTranslations("Community");
   const locale = useLocale();
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
   } = useGetAllCommunity(page, debouncedSearch, locale);

   if (isPending)
      return (
         <div className="flex flex-col gap-6 lg:gap-8">
            <SkeletonLayout count={6} SkeletonComponent={CommunitySkeleton} />
         </div>
      );

   return (
      <section
         role="main"
         aria-labelledby="community-section-title"
         className="min-h-screen"
      >
         <h1 id="community-section-title" className="sr-only">
            {t("communitySectionTitle")}
         </h1>
         <p className="sr-only">{t("communitySectionDescription")}</p>

         <SearchBox search={search} setSearch={setSearch} />
         {communityData?.data?.communities.length === 0 && (
            <div className="mt-10 text-center" role="status" aria-live="polite">
               {t("noSearchResults")}
            </div>
         )}
         <div className="mt-4 flex flex-col">
            {communityData?.data?.communities.map(
               (data: CommunityWithDetails, idx: number) => (
                  <Link
                     key={data.id}
                     href={`/community/${data.id}`}
                     className={`block ${isSearching || isLoading ? "pointer-events-none opacity-50" : ""} ${idx === communityData?.data?.communities.length - 1 ? "" : "border-line-100 border-b-1"}`}
                  >
                     <Community
                        title={data.title}
                        userNickname={data.userNickname}
                        date={data.createdAt}
                        content={data.content}
                        replyCount={data.replies.length}
                        profileImg={data.profileImg}
                     />
                  </Link>
               ),
            )}
         </div>

         <Pagination
            page={page}
            totalPages={communityData.data.totalPages}
            onPageChange={setPage}
            aria-label={t("paginationNav")}
         />
      </section>
   );
}
