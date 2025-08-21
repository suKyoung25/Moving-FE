"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";

export default function CommunityIndex({
   index,
}: {
   index: string | React.ReactNode;
}) {
   const t = useTranslations("Community");
   const router = useRouter();

   return (
      <div className="text-14-medium flex items-center gap-2 text-gray-300">
         <button
            type="button"
            onClick={() => router.push("/community")}
            className="hover:text-gray-500"
         >
            {t("title")}
         </button>
         <IoIosArrowForward />
         {typeof index === "string" ? (
            <p className="text-14-medium">{index}</p>
         ) : (
            index
         )}
      </div>
   );
}
