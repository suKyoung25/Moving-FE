import React from "react";
import Image from "next/image";
import carImage from "@/assets/images/emptyCarIcon.svg";
import Link from "next/link";
import SolidButton from "@/components/common/SolidButton";

export default function Step4() {
   return (
      <div className="mt-30 flex flex-col items-center gap-8">
         <Image
            src={carImage}
            alt="견적 요청 진행중"
            className="w-61 lg:mb-8 lg:w-[402px]"
         />
         <p className="flex justify-center text-center text-sm text-gray-400 lg:text-xl">
            현재 진행 중인 이사 견적이 있어요!
            <br />
            진행 중인 이사 완료 후 새로운 견적을 받아보세요.
         </p>
         <Link href="/my-quotes/client">
            <SolidButton className="max-w-[196px] px-6">
               받은 견적 보러가기
            </SolidButton>
         </Link>
      </div>
   );
}
