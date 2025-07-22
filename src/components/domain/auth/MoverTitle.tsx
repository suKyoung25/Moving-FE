import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/images/logoText.svg";
import { MoverAuthProps } from "@/lib/types";

// 회원가입 & 로그인 페이지 제목 로고 및 링크 (일반 회원)
export default function MoverTitle({ type }: MoverAuthProps) {
   return (
      <div className="mb-10">
         <Link href="/mover-search">
            <figure className="relative mx-auto h-11 w-22 lg:h-13 lg:w-26">
               <Image src={logo} alt="무빙 로고" fill />
            </figure>
         </Link>
         <div className="lg:mt- mt-4 flex gap-1 lg:gap-2">
            <p className="text-black-100 text-12-regular lg:text-20-regular">
               일반 유저라면?
            </p>
            <Link
               href={type === "login" ? "/sign-in/client" : "/sign-up/client"}
               className="text-primary-blue-300 text-12-semibold lg:text-20-semibold underline"
            >
               일반 유저 전용 페이지
            </Link>
         </div>
      </div>
   );
}
