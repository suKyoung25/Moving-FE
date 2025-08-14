"use client";

import { useRouter } from "next/navigation";
import Community from "./Community";
import CommunityButton from "./CommunityButton";
import SearchBox from "./SearchBox";
import { useGetAllCommunity } from "@/lib/api/community/query";
import Pagination from "@/components/common/Pagination";
import { useEffect, useState } from "react";
import { CommunityWithDetails } from "@/lib/types/community.types";
import { useLocale, useTranslations } from "next-intl";

export default function CommunityBox() {
   const t = useTranslations("Community");
   const locale = useLocale();
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
   } = useGetAllCommunity(page, debouncedSearch, locale);

   if (isPending)
      return (
         <div
            className="flex items-center justify-center"
            role="status"
            aria-live="polite"
         >
            {t("loading")}
         </div>
      );

   console.log(communityData);

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

         <CommunityButton address={"create"} text={t("writePost")} />
         <SearchBox search={search} setSearch={setSearch} />

         {communityData?.data?.communities.length === 0 && (
            <div className="mt-10 text-center" role="status" aria-live="polite">
               {t("noSearchResults")}
            </div>
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
            aria-label={t("paginationNav")}
         />
      </section>
   );
}
