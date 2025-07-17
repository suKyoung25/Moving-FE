"use client";

import React from "react";
import Image from "next/image";
import profileUploaderIcon from "@/assets/images/profileUploaderIcon.svg";
import { useAuth } from "@/context/AuthContext";

export default function ProfileImage() {
   const { user } = useAuth();

   return (
      <section>
         {/* 제목 */}
         <p className="text-black-300 text-16-semibold lg:text-20-semibold mb-4 lg:mb-6">
            프로필 이미지
         </p>

         {/* 이미지 */}
         <figure className="relative mb-5 h-25 w-25 cursor-pointer lg:h-80 lg:w-80">
            <Image
               src={
                  user?.profileImage ? user.profileImage : profileUploaderIcon
               }
               alt="프로필 이미지"
               fill
               // onClick={}
            />
         </figure>

         {/* 진짜로 클릭(반영)되는 이미지 input */}
         <input type="image" className="hidden" />
      </section>
   );
}
