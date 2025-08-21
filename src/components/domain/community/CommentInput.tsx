"use client";

import { useAuth } from "@/context/AuthContext";
import { useGetReplies, usePostReply } from "@/lib/api/community/query";
import { useState } from "react";
import { useTranslations } from "next-intl";
import LoginRequiredModal from "../mover-search/LoginRequiredModal";
import Image from "next/image";
import commentIcon from "@/assets/images/commentIcon.svg";

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
         <div className="flex items-center gap-1">
            <Image
               alt={t("commentIconAlt")}
               src={commentIcon}
               width={16}
               height={16}
            />
            <p
               className="text-14-regular text-gray-400"
               aria-label={t("replyCountAria", { count: actualCount })}
            >
               {t("reply")} {actualCount}
            </p>
         </div>
         <form
            onSubmit={handleSubmit}
            className="focus:border-primary-blue-300 border-line-200 mt-5 flex w-full items-center justify-between rounded-xl border px-4 py-2"
         >
            <textarea
               value={content}
               onChange={(e) => setContent(e.target.value)}
               placeholder={t("commentPlaceholder")}
               onClick={handleInputclick}
               disabled={isPending}
               aria-label={t("commentInputAria")}
               className="scrollbar-hide text-14-regular lg:text-16-regular w-full"
               aria-describedby={isError ? "comment-error" : undefined}
            />
            {content && (
               <button
                  type="submit"
                  disabled={isPending}
                  className="text-primary-blue-300 text-14-medium lg:text-16-medium min-w-16 text-right"
               >
                  {isPending ? t("saving") : t("save")}
               </button>
            )}
         </form>
         {isError && (
            <p
               id="comment-error"
               className="text-14-medium text-secondary-red-200 mt-1 ml-2"
               role="alert"
               aria-live="assertive"
            >
               {t("commentPostFailed")}
            </p>
         )}
         {isLogin && (
            <LoginRequiredModal
               isOpen={isLogin}
               onClose={() => setIsLogin(false)}
            />
         )}
      </>
   );
}
