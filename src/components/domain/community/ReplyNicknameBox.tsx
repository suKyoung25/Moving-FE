"use client";

import ConfirmModal from "@/components/common/ConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { useDeleteReply } from "@/lib/api/community/query";
import { useLocale, useTranslations } from "next-intl";
import React, { useRef, useState } from "react";
import Image from "next/image";
import more from "@/assets/images/moreGrayIcon.svg";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { formatDistanceToNow } from "date-fns";
import { enUS, ko, zhCN } from "date-fns/locale";

interface ReplyNicknameBoxProps {
   userNickname: string;
   authorId: string | null;
   replyId: string;
   communityAuthorId: string;
   onEdit: () => void;
   isEditing: boolean;
   createdAt: Date;
}

export default function ReplyNicknameBox({
   userNickname,
   authorId,
   replyId,
   communityAuthorId,
   onEdit,
   isEditing,
   createdAt,
}: ReplyNicknameBoxProps) {
   const t = useTranslations("Community");
   const locale = useLocale();
   const { user } = useAuth();
   const [isModal, setIsModal] = useState(false);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   useOutsideClick(dropdownRef, () => setIsDropdownOpen(false));

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
         <div
            ref={dropdownRef}
            className="relative flex w-full items-center justify-between"
         >
            <div>
               <div className="flex items-center gap-2">
                  <p className="text-14-semibold lg:text-16-semibold">
                     {userNickname}
                  </p>
                  {authorId === communityAuthorId && (
                     <p
                        className="text-12-medium border-primary-blue-300 text-primary-blue-300 rounded-full border px-2"
                        aria-label={t("authorLabel")}
                     >
                        {t("author")}
                     </p>
                  )}
               </div>
               <p
                  className="text-12-regular mt-0.5 text-gray-200"
                  aria-label={t("replyTimeAria", {
                     name: userNickname,
                  })}
               >
                  {formatDistanceToNow(new Date(createdAt), {
                     addSuffix: true,
                     locale:
                        locale === "ko" ? ko : locale === "en" ? enUS : zhCN,
                  })}
               </p>
            </div>
            {user?.id === authorId && (
               <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
               >
                  {!isEditing && (
                     <Image
                        src={more}
                        width={14}
                        height={14}
                        alt="더보기"
                        style={{ transform: "rotate(90deg)" }}
                        className="absolute top-2 right-0"
                     />
                  )}
               </button>
            )}
            {isDropdownOpen && !isEditing && (
               <ul className="text-14-medium lg:text-16-medium absolute top-8 right-0 flex w-30 flex-col lg:w-32">
                  <button
                     type="button"
                     onClick={() => {
                        onEdit();
                        setIsDropdownOpen(false);
                     }}
                     className="border-line-100 h-9 w-full rounded-tl-lg rounded-tr-lg border bg-white hover:bg-gray-50 lg:h-10"
                  >
                     {t("editReply")}
                  </button>
                  <button
                     type="button"
                     onClick={() => setIsModal(true)}
                     className="border-line-100 h-9 w-full rounded-br-lg rounded-bl-lg border bg-white hover:bg-gray-50 lg:h-10"
                     aria-label={t("deleteReplyAria", { name: userNickname })}
                     title={t("deleteReply")}
                  >
                     {t("deleteReply")}
                  </button>
               </ul>
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
