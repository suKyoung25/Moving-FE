// import ProfileImage from "@/components/profile/ProfileImage";
import React from "react";

const titleStyle = "text-black-300 text-16-semibold lg:text-20-semibold";

export default function ClientProfileForm() {
   return (
      <>
         {/* 이미지 */}
         <section className="mb-6">
            <p className={titleStyle}>프로필 이미지</p>
            {/* <ProfileImage /> */}
         </section>

         <section></section>
         <section></section>
      </>
   );
}
