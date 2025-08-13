"use client";

import { useAuth } from "@/context/AuthContext";
import { useGetReplies, usePostReply } from "@/lib/api/community/query";
import { useState } from "react";
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
            <Image alt="댓글아이콘" src={commentIcon} />
            <p>{actualCount}</p>
         </div>
         <form onSubmit={handleSubmit} className="mt-5">
            <input
               value={content}
               onChange={(e) => setContent(e.target.value)}
               type="text"
               placeholder="댓글을 작성해 보세요."
               onClick={handleInputclick}
               disabled={isPending}
               className="bg-bg-200 h-14 w-full rounded-2xl px-4"
            />
            {isError && (
               <p className="text-14-semibold text-secondary-red-200">
                  댓글 등록에 실패했습니다
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
