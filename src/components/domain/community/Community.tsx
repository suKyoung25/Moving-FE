import ProfileBox from "./ProfileBox";

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
   return (
      <div className="cursor-pointer rounded-2xl px-3.5 py-4 shadow lg:px-6 lg:py-5">
         <p className="text-14-semibold md:text-18-semibold">{title}</p>
         <p className="text-14-regular lg:text-18-regular line-clamp-2 whitespace-pre-wrap">
            {content}
         </p>
         <ProfileBox
            date={date}
            userNickname={userNickname}
            replyCount={replyCount}
            profileImg={profileImg}
            isreply={true}
         />
      </div>
   );
}
