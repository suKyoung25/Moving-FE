import Image from "next/image";
import ProfileBox from "./ProfileBox";
import commentIcon from "@/assets/images/commentIcon.svg";
import { useTranslations } from "next-intl";

interface CommunityProps {
   title: string;
   userNickname: string;
   date: Date;
   content: string;
   replyCount: number;
   profileImg: string | null;
}

export default function Community({
   title,
   userNickname,
   date,
   content,
   replyCount,
   profileImg,
}: CommunityProps) {
   const t = useTranslations("Community");

   return (
      <div className="flex flex-col gap-4 px-2 py-5 lg:px-4 lg:py-7">
         <div>
            <p className="text-14-semibold md:text-16-semibold lg:text-18-semibold">
               {title}
            </p>
            <p className="text-14-regular md:text-16-regular lg:text-18-regular line-clamp-2 whitespace-pre-wrap text-gray-500">
               {content}
            </p>
         </div>
         <div className="flex items-center justify-between">
            <ProfileBox
               date={date}
               userNickname={userNickname}
               profileImg={profileImg}
            />
            <div className="flex items-center justify-end gap-1">
               <Image
                  alt={t("commentIconAlt")}
                  src={commentIcon}
                  width={16}
                  height={16}
                  className="lg:h-5 lg:w-5"
               />
               <p
                  className="text-14-regular lg:text-16-regular text-gray-200"
                  aria-label={t("replyCountAria", {
                     count: replyCount || 0,
                  })}
               >
                  {replyCount}
               </p>
            </div>
         </div>
      </div>
   );
}
