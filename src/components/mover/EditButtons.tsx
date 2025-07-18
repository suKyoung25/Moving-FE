import React from "react";
import Link from "next/link";
import Image from "next/image";
import SolidButton from "../common/buttons/SolidButton";
import OutlinedButton from "../common/buttons/OutlinedButton";
import writingIcon from "@/assets/images/writingIcon.svg";
import writingIconGray from "@/assets/images/writingIconGray.svg";

const btnClass = "flex w-full items-center justify-center gap-2";

export default function EditButtons() {
   return (
      <>
         <SolidButton className={btnClass}>
            <Link href="/profile/edit">내 프로필 수정</Link>
            <Image src={writingIcon} alt="프로필 수정" className="h-6 w-6" />
         </SolidButton>
         <OutlinedButton
            className={`${btnClass} hover:!bg-bg-200 !border-gray-200 !text-gray-300`}
         >
            <Link href="/dashboard/edit-account">기본 정보 수정</Link>
            <Image
               src={writingIconGray}
               alt="기본정보 수정"
               className="h-6 w-6"
            />
         </OutlinedButton>
      </>
   );
}
