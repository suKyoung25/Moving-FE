"use client";

import ConfirmModal from "@/components/common/ConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { deleteCommunity } from "@/lib/api/community/deleteCommunity";
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
               <p
                  onClick={() => setIsModal(true)}
                  className="text-12-regular cursor-pointer text-gray-300"
               >
                  삭제하기
               </p>
            )}
         </div>
         {isModal && (
            <ConfirmModal
               isOpen={isModal}
               title="게시글을 삭제하시겠습니까?"
               description="이 작업은 되돌릴 수 없습니다"
               onClose={() => setIsModal(false)}
               onConfirm={handleConfirm}
            />
         )}
      </>
   );
}
