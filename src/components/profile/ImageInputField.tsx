"use client";

import Image from "next/image";
import React from "react";
import profileUploaderIcon from "@/assets/images/profileUploaderIcon.svg";
import { InputFieldProps } from "@/lib/types/profile.types";

//프로필 이미지 input인 경우
function ImageInputField({ text }: InputFieldProps) {
   return (
      <div className="text-16-semibold lg:text-20-semibold flex flex-col gap-4">
         <div>{text}</div>
         <Image
            src={profileUploaderIcon}
            width={160}
            height={160}
            alt="비어있는 프로필 이미지"
            onClick={() => {
               console.log("프로필 이미지 등록 버튼 클릭");
            }}
         />
      </div>
   );
}

export default ImageInputField;
