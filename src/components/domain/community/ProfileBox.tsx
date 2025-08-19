import Image from "next/image";
import React from "react";
import profile from "@/assets/images/profileIcon.svg";
import { format } from "date-fns";
import { zhCN, enUS, ko } from "date-fns/locale";
import commentIcon from "@/assets/images/commentIcon.svg";
import { useLocale, useTranslations } from "next-intl";

interface ProfileBoxProps {
   date: Date;
   userNickname: string;
   replyCount?: number;
   profileImg: string | null;
   isreply: boolean;
}

export default function ProfileBox({
   date,
   userNickname,
   replyCount,
   profileImg,
   isreply,
}: ProfileBoxProps) {
   const t = useTranslations("Community");
   const locale = useLocale();
   return (
      <div className="border-line-100 mt-4 flex items-center gap-3 rounded-md border p-2.5 lg:gap-6">
         <div className="h-13 w-13 overflow-hidden rounded-full">
            <Image
               alt={t("profileImageAlt", { name: userNickname })}
               src={profileImg || profile}
               width={200}
               height={200}
               className="object-cover"
            />
         </div>
         <div className="flex w-full items-center justify-between">
            <p className="text-14-semibold lg:text-18-semibold">
               {userNickname}님
            </p>
            <div>
               {isreply && (
                  <div className="flex items-center justify-end">
                     <Image
                        alt={t("commentIconAlt")}
                        src={commentIcon}
                        width={16}
                        height={16}
                     />
                     <p
                        aria-label={t("replyCountAria", {
                           count: replyCount || 0,
                        })}
                     >
                        {replyCount}
                     </p>
                  </div>
               )}

               <p className="text-13-medium mt-1 text-gray-300">
                  {format(
                     date,
                     locale === "ko"
                        ? "yyyy. MM. dd(eee) aa hh:mm"
                        : locale === "en"
                          ? "MMM dd, yyyy (eee) h:mm a"
                          : "yyyy年 MM月 dd日 (eee) h:mm a",
                     {
                        locale:
                           locale === "ko" ? ko : locale === "en" ? enUS : zhCN,
                     },
                  )}
               </p>
            </div>
         </div>
      </div>
   );
}
