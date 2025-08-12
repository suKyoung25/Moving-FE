"use client";

import { useAuth } from "@/context/AuthContext";
import { usePostReply } from "@/lib/api/community/query";
import { useState } from "react";
import LoginRequiredModal from "../mover-search/LoginRequiredModal";

export default function CommentInput({ id }: { id: string }) {
   const [content, setContent] = useState("");
   const [isLogin, setIsLogin] = useState<boolean>(false);
   const { mutate: postReply, isPending, isError } = usePostReply();
   const { user } = useAuth();

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
