"use client";

import ConfirmModal from "@/components/common/ConfirmModal";
import LineDivider from "@/components/common/LineDivider";
import { useAuth } from "@/context/AuthContext";
import { deleteCommunity } from "@/lib/api/community/requests/deleteCommunity";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CommunityTitleProps {
   title: string;
   authorId: string;
   communityId: string;
}

export default function CommunityTitle({
   title,
   authorId,
   communityId,
}: CommunityTitleProps) {
   const t = useTranslations("Community");
   const { user } = useAuth();
   const router = useRouter();
   const [isDeleteModal, setIsDeleteModal] = useState(false);

   const handleDelete = async () => {
      if (!user?.id) return;

      try {
         await deleteCommunity(communityId);
         router.push("/community");
      } catch (e) {
         console.error(e);
      }
   };

   const handleEdit = () => {
      router.push(`/community/${communityId}/edit`);
   };

   return (
      <>
         <div className="mb-4 flex justify-between">
            <h1 className="text-18-semibold md:text-20-semibold">{title}</h1>
            {user?.id === authorId && (
               <div className="flex items-center">
                  <button
                     onClick={handleEdit}
                     className="text-12-regular lg:text-14-regular text-gray-300 transition-colors hover:text-gray-500"
                     aria-label={t("editCommunityAria", { title })}
                     title={t("editCommunity")}
                  >
                     {t("editCommunity")}
                  </button>
                  <LineDivider isVertical={true} />
                  <button
                     onClick={() => setIsDeleteModal(true)}
                     className="text-12-regular lg:text-14-regular text-gray-300 transition-colors hover:text-gray-500"
                     aria-label={t("deleteCommunityAria", { title })}
                     title={t("deleteCommunity")}
                  >
                     {t("deleteCommunity")}
                  </button>
               </div>
            )}
         </div>

         {isDeleteModal && (
            <ConfirmModal
               isOpen={isDeleteModal}
               title={t("confirmDeleteTitle")}
               description={t("confirmDeleteDescription")}
               onClose={() => setIsDeleteModal(false)}
               onConfirm={handleDelete}
            />
         )}
      </>
   );
}
