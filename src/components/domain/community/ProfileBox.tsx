import Image from "next/image";
import React from "react";
import profile from "@/assets/images/profileIcon.svg";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import commentIcon from "@/assets/images/commentIcon.svg";

interface ProfileBoxProps {
   userNickname: string;
   date: Date;
   replyCount?: number;
   profileImg: string | null;
   isreply: boolean;
}

export default function ProfileBox({
   userNickname,
   date,
   replyCount,
   profileImg,
   isreply,
}: ProfileBoxProps) {
   return (
      <div className="border-line-100 mt-4 flex items-center gap-3 rounded-md border p-2.5 lg:gap-6">
         <div className="h-13 w-13 overflow-hidden rounded-full">
            <Image
               alt="프로필 이미지"
               src={profileImg || profile}
               width={200}
               height={200}
               className="object-cover"
            />
         </div>
         <div className="flex w-full items-center justify-between">
            <p className="text-14-semibold lg:text-18-semibold">
               {userNickname}
            </p>
            <div>
               {isreply && (
                  <div className="flex items-center justify-end">
                     <Image alt="댓글 아이콘" src={commentIcon} />
                     <p>{replyCount}</p>
                  </div>
               )}

               <p className="text-13-medium mt-1 text-gray-300">
                  {format(date, "yyyy. MM. dd(eee) aa hh:mm", {
                     locale: ko,
                  })}
               </p>
            </div>
         </div>
      </div>
   );
}
