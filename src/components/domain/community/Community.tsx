import Image from "next/image";
import profile from "@/assets/images/profileIcon.svg";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface CommunityProps {
   title: string;
   userNickname: string;
   date: string;
   content: string;
   replyCount: number;
}

export default function Community({
   title,
   userNickname,
   date,
   content,
   replyCount,
}: CommunityProps) {
   return (
      <div className="mt-7.5 cursor-pointer rounded-2xl px-3.5 py-4 shadow-[0_-2px_10px_rgba(220,220,220,0.2),_0_2px_10px_rgba(220,220,220,0.14)]">
         <p className="text-14-semibold md:text-18-semibold">{title}</p>
         <p className="text-14-regular lg:text-18-regular">{content}</p>
         <div className="border-line-100 mt-4 flex items-center gap-3 rounded-md border p-2.5 lg:gap-6">
            <Image alt="프로필 이미지" src={profile} width={52} height={52} />
            <div className="flex w-full items-center justify-between">
               <p className="text-14-semibold lg:text-18-semibold">
                  {userNickname} 님
               </p>
               <div>
                  <div className="flex items-center justify-end">
                     <p>📝{replyCount}</p>
                  </div>
                  <p className="text-13-medium mt-1 text-gray-300">
                     {format(date, "yyyy. MM. dd(eee) aa hh:mm", {
                        locale: ko,
                     })}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
