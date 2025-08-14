"use client";

import ConfirmModal from "@/components/common/ConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { useDeleteReply } from "@/lib/api/community/query";
import React, { useState } from "react";

interface ReplyNicknameBoxProps {
   userNickname: string;
   authorId: string | null;
   replyId: string;
   communityAuthorId: string;
}

export default function ReplyNicknameBox({
   userNickname,
   authorId,
   replyId,
   communityAuthorId,
}: ReplyNicknameBoxProps) {
   const { user } = useAuth();
   const [isModal, setIsModal] = useState(false);

   const deleteReplyMutation = useDeleteReply();

   const handleConfirm = async () => {
      if (!user?.id) return;

      try {
         await deleteReplyMutation.mutateAsync(replyId);
         setIsModal(false);
      } catch (e) {
         console.error(e);
      }
   };

   return (
      <>
         <div className="flex items-center gap-2">
            <p className="text-14-semibold md:text-16-semibold">
               {userNickname}
            </p>
            {authorId === communityAuthorId && (
               <p className="text-12-medium bg-gray-100 px-1 py-0.5">작성자</p>
            )}
            {user?.id === authorId && (
               <>
                  <p
                     onClick={() => setIsModal(true)}
                     className="text-12-regular cursor-pointer text-gray-300"
                  >
                     삭제하기
                  </p>
               </>
            )}
         </div>
         {isModal && (
            <ConfirmModal
               isOpen={isModal}
               title="댓글을 삭제하시겠습니까?"
               description="이 작업은 되돌릴 수 없습니다"
               onClose={() => setIsModal(false)}
               onConfirm={handleConfirm}
            />
         )}
      </>
   );
}
