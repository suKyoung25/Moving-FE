"use client";

import ConfirmModal from "@/components/common/ConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { deleteCommunity } from "@/lib/api/community/deleteCommunity";
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
   const [isModal, setIsModal] = useState(false);

   const handleConfirm = async () => {
      if (!user?.id) return;

      try {
         await deleteCommunity(communityId);
         router.push("/community");
      } catch (e) {
         console.error(e);
      }
   };

   return (
      <>
         <div className="flex justify-between">
            <p className="text-18-semibold md:text-24-semibold">{title}</p>
            {user?.id === authorId && (
               <button
                  onClick={() => setIsModal(true)}
                  className="text-12-regular cursor-pointer text-gray-300 transition-colors hover:text-gray-500"
                  aria-label={t("deleteCommunityAria", { title })}
                  title={t("deleteCommunity")}
               >
                  {t("deleteCommunity")}
               </button>
            )}
         </div>
         {isModal && (
            <ConfirmModal
               isOpen={isModal}
               title={t("confirmDeleteTitle")}
               description={t("confirmDeleteDescription")}
               onClose={() => setIsModal(false)}
               onConfirm={handleConfirm}
            />
         )}
      </>
   );
}
