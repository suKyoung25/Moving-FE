import React from "react";
import Link from "next/link";
import Image from "next/image";
import SolidButton from "@/components/common/SolidButton";
import OutlinedButton from "@/components/common/OutlinedButton";
import writingIcon from "@/assets/images/writingIcon.svg";
import writingIconGray from "@/assets/images/writingIconGray.svg";

const btnClass = "flex w-full items-center justify-center gap-2";

export default function EditButtons() {
   return (
      <>
         <Link href="/profile/edit" className="w-full">
            <SolidButton className={btnClass}>
               내 프로필 수정
               <Image src={writingIcon} alt="프로필 수정" className="h-6 w-6" />
            </SolidButton>
         </Link>
         <Link href="/dashboard/edit-account" className="w-full">
            <OutlinedButton
               className={`${btnClass} hover:!bg-bg-200 !border-gray-200 !text-gray-300`}
            >
               기본 정보 수정
               <Image
                  src={writingIconGray}
                  alt="기본정보 수정"
                  className="h-6 w-6"
               />
            </OutlinedButton>
         </Link>
      </>
   );
}
