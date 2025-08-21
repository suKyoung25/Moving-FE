import Image from "next/image";
import React from "react";
import profile from "@/assets/images/profileIcon.svg";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import { enUS, ko, zhCN } from "date-fns/locale";

interface ProfileBoxProps {
   date: Date;
   userNickname: string;
   profileImg: string | null;
   isDetail?: boolean;
}

export default function ProfileBox({
   date,
   userNickname,
   profileImg,
   isDetail,
}: ProfileBoxProps) {
   const t = useTranslations("Community");
   const locale = useLocale();

   return (
      <div className="flex items-center gap-2 lg:gap-3">
         <Image
            alt={t("profileImageAlt", { name: userNickname })}
            src={profileImg || profile}
            width={32}
            height={32}
            className={`object-cover ${isDetail ? "h-7 w-7" : ""}`}
         />
         <div className="flex w-full items-center gap-2">
            <p className="text-14-semibold lg:text-16-semibold">
               {userNickname}
            </p>
            <p className="text-12-regular lg:text-14-regular text-gray-300">
               {isDetail
                  ? format(
                       date,
                       locale === "ko"
                          ? "yyyy. MM. dd. HH:mm"
                          : locale === "en"
                            ? "MMM dd, yyyy eee h:mm a"
                            : "yyyy年 MM月 dd日 eee HH:mm",
                       {
                          locale:
                             locale === "ko"
                                ? ko
                                : locale === "en"
                                  ? enUS
                                  : zhCN,
                       },
                    )
                  : format(date, "yyyy. MM. dd")}
            </p>
         </div>
      </div>
   );
}
