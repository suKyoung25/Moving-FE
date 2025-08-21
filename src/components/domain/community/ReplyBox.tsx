"use client";

import { useGetReplies } from "@/lib/api/community/query";
import { useLocale, useTranslations } from "next-intl";
import { ReplyWithDetails } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import ReplyItem from "./ReplyItem";

export default function ReplyBox({
   community,
   communityAuthorId,
}: {
   community: string;
   communityAuthorId: string;
}) {
   const t = useTranslations("Community");
   const locale = useLocale();
   const queryClient = useQueryClient();
   const { data, isPending } = useGetReplies(community, locale);

   if (isPending && !data)
      return (
         <div role="status" aria-live="polite" className="py-4 text-center">
            {t("loading")}
         </div>
      );

   const replies = data || [];

   // 댓글 목록 갱신 함수
   const handleUpdate = () => {
      queryClient.invalidateQueries({
         queryKey: ["communityReplies", community, locale],
      });
   };

   return (
      <>
         {replies.length === 0 ? (
            <div
               className="py-8 text-center text-gray-500"
               role="status"
               aria-live="polite"
            >
               {t("noRepliesYet")}
            </div>
         ) : (
            replies.map((reply: ReplyWithDetails) => (
               <ReplyItem
                  key={reply.id}
                  reply={reply}
                  communityAuthorId={communityAuthorId}
                  onUpdate={handleUpdate}
               />
            ))
         )}
      </>
   );
}
