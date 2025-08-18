"use client";

import { useAuth } from "@/context/AuthContext";
import { useGetReplies, usePostReply } from "@/lib/api/community/query";
import { useState } from "react";
import LoginRequiredModal from "../mover-search/LoginRequiredModal";
import Image from "next/image";
import commentIcon from "@/assets/images/commentIcon.svg";
import { useTranslations } from "next-intl";

export default function CommentInput({
   id,
   count,
}: {
   id: string;
   count: number;
}) {
   const t = useTranslations("Community");
   const [content, setContent] = useState("");
   const [isLogin, setIsLogin] = useState<boolean>(false);
   const { mutate: postReply, isPending, isError } = usePostReply();
   const { user } = useAuth();

   const { data: replies } = useGetReplies(id);

   const actualCount = replies?.length ?? count;

   const handleInputclick = () => {
      if (!user) {
         setIsLogin(true);
         return;
      }
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!content.trim()) return;

      postReply(
         { id, content },
         {
            onSuccess: () => {
               setContent("");
            },
         },
      );
   };

   return (
      <>
         <div className="mt-10 flex items-center gap-1">
            <Image
               alt={t("commentIconAlt")}
               src={commentIcon}
               width={16}
               height={16}
            />
            <p aria-label={t("replyCountAria", { count: actualCount })}>
               {actualCount}
            </p>
         </div>
         <form onSubmit={handleSubmit} className="mt-5">
            <input
               value={content}
               onChange={(e) => setContent(e.target.value)}
               type="text"
               placeholder={t("commentPlaceholder")}
               onClick={handleInputclick}
               disabled={isPending}
               className="bg-bg-200 h-14 w-full rounded-2xl px-4"
               aria-label={t("commentInputAria")}
               aria-describedby={isError ? "comment-error" : undefined}
            />
            {isError && (
               <p
                  id="comment-error"
                  className="text-14-semibold text-secondary-red-200"
                  role="alert"
                  aria-live="assertive"
               >
                  {t("commentPostFailed")}
               </p>
            )}
         </form>
         {isLogin && (
            <LoginRequiredModal
               isOpen={isLogin}
               onClose={() => setIsLogin(false)}
            />
         )}
      </>
   );
}
