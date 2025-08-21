import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";

export default function CommunityIndex({
   index,
}: {
   index: string | React.ReactNode;
}) {
   const t = useTranslations("Community");

   return (
      <div className="text-14-medium flex items-center gap-2 text-gray-300">
         <Link href="/community" className="hover:text-gray-500">
            {t("title")}
         </Link>
         <IoIosArrowForward />
         <p className="text-14-medium">{index}</p>
      </div>
   );
}
