"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginRequiredModal from "../mover-search/LoginRequiredModal";
import { PiPencilSimpleLineBold } from "react-icons/pi";

interface CommunityButtonProps {
   text: string;
   address: string;
}

export default function CommunityButton({
   text,
   address,
}: CommunityButtonProps) {
   const router = useRouter();
   const { user } = useAuth();
   const [isLogin, setIsLogin] = useState<boolean>(false);

   const handleClick = () => {
      if (!user) {
         setIsLogin(true);
         return;
      }

      router.push(`/community/${address}`);
   };

   return (
      <>
         <div className="flex items-center justify-end">
            <button
               onClick={handleClick}
               className="bg-primary-blue-300 hover:bg-primary-blue-200 text-16-semibold flex h-11 items-center justify-center gap-2 rounded-2xl px-6 text-white"
            >
               {text}
               <PiPencilSimpleLineBold />
            </button>
         </div>
         {isLogin && (
            <LoginRequiredModal
               isOpen={isLogin}
               onClose={() => setIsLogin(false)}
            />
         )}
      </>
   );
}
