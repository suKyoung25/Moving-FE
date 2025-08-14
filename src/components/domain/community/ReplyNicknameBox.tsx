"use client";

import ConfirmModal from "@/components/common/ConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { useDeleteReply } from "@/lib/api/community/query";
import { useTranslations } from "next-intl";
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
   const t = useTranslations("Community");
   const { user } = useAuth();
   const [isModal, setIsModal] = useState(false);

   const deleteReplyMutation = useDeleteReply();

   const handleConfirm = async () => {
      if (!user?.id) return;

      try {
         await deleteReplyMutation.mutateAsync(replyId);
         setIsModal(false);
      } catch (e) {
         console.log(e);
      }
   };

   return (
      <>
         <div className="flex items-center gap-2">
            <p className="text-14-semibold md:text-16-semibold">
               {userNickname}
            </p>
            {authorId === communityAuthorId && (
               <p
                  className="text-12-medium bg-gray-100 px-1 py-0.5"
                  aria-label={t("authorLabel")}
               >
                  {t("author")}
               </p>
            )}
            {user?.id === authorId && (
               <>
                  <button
                     onClick={() => setIsModal(true)}
                     className="text-12-regular cursor-pointer text-gray-300 transition-colors hover:text-gray-500"
                     aria-label={t("deleteReplyAria", { name: userNickname })}
                     title={t("deleteReply")}
                  >
                     {t("deleteReply")}
                  </button>
               </>
            )}
         </div>
         {isModal && (
            <ConfirmModal
               isOpen={isModal}
               title={t("confirmDeleteReplyTitle")}
               description={t("confirmDeleteReplyDescription")}
               onClose={() => setIsModal(false)}
               onConfirm={handleConfirm}
            />
         )}
      </>
   );
}
