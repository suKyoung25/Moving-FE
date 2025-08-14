"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginRequiredModal from "../mover-search/LoginRequiredModal";

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
               className="bg-primary-blue-300 text-18-semibold h-11 w-29 rounded-2xl text-white"
            >
               {text}
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
