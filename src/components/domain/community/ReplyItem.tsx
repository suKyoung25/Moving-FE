"use client";

import Image from "next/image";
import profile from "@/assets/images/profileIcon.svg";
import ReplyNicknameBox from "./ReplyNicknameBox";
import { useTranslations } from "next-intl";
import { ReplyWithDetails } from "@/lib/types";
import { updateReply } from "@/lib/api/community/requests/updateReply";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";

interface ReplyItemProps {
   reply: ReplyWithDetails;
   communityAuthorId: string;
   onUpdate: () => void;
}

export default function ReplyItem({
   reply,
   communityAuthorId,
   onUpdate,
}: ReplyItemProps) {
   const t = useTranslations("Community");
   const { showSuccess, showError } = useToast();
   const [isEditing, setIsEditing] = useState(false);
   const [editContent, setEditContent] = useState(reply.content);

   const handleUpdateReply = async () => {
      try {
         await updateReply(reply.id, editContent);
         setIsEditing(false);
         onUpdate(); // 댓글 목록 새로고침
         showSuccess("댓글이 수정되었습니다.");
      } catch (error) {
         console.error("댓글 수정 실패:", error);
         showError("댓글 수정에 실패했습니다.");
      }
   };

   const handleCancel = () => {
      setEditContent(reply.content);
      setIsEditing(false);
   };

   return (
      <div className="mt-6 md:mt-8">
         <div className="flex items-center gap-3">
            <Image
               alt={t("profileImageAlt", {
                  name: reply.userNickname,
               })}
               src={reply.profileImg || profile}
               width={40}
               height={40}
               className="object-cover"
            />
            <ReplyNicknameBox
               userNickname={reply.userNickname}
               authorId={reply.clientId || reply.moverId}
               replyId={reply.id}
               communityAuthorId={communityAuthorId}
               onEdit={() => setIsEditing(true)}
               isEditing={isEditing}
               createdAt={reply.createdAt}
            />
         </div>

         {isEditing ? (
            <div className="mt-3 pl-13.5">
               <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="text-14-regular lg:text-16-regular border-line-200 w-full rounded-lg border p-3 focus:border-gray-200"
                  rows={3}
                  placeholder={t("editReplyPlaceholder")}
               />
               <div className="text-14-semibold mt-2 flex justify-end gap-1">
                  <button
                     onClick={handleCancel}
                     className="border-primary-blue-300 text-primary-blue-300 hover:bg-primary-blue-50 w-18 rounded-xl border-1 border-solid"
                  >
                     {t("cancel")}
                  </button>
                  <button
                     onClick={handleUpdateReply}
                     className="bg-primary-blue-300 hover:bg-primary-blue-200 w-18 rounded-xl py-1 text-white"
                  >
                     {t("save")}
                  </button>
               </div>
            </div>
         ) : (
            <p
               className="text-14-medium lg:text-16-medium mt-4 pl-13"
               aria-label={t("replyContentAria", {
                  name: reply.userNickname,
               })}
            >
               {reply.content}
            </p>
         )}
      </div>
   );
}
