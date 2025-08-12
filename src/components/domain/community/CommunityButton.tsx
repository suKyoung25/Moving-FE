"use client";

import { useRouter } from "next/navigation";

interface CommunityButtonProps {
   text: string;
   address: string;
}

export default function CommunityButton({
   text,
   address,
}: CommunityButtonProps) {
   const router = useRouter();
   return (
      <div className="flex items-center justify-end">
         <button
            onClick={() => router.push(`/community/${address}`)}
            className="bg-primary-blue-300 text-18-semibold h-11 w-29 rounded-2xl text-white"
         >
            {text}
         </button>
      </div>
   );
}
