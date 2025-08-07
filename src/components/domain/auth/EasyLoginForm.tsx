"use client";

import React from "react";
import Image from "next/image";
import googleIcon from "@/assets/images/logoGoogle.svg";
import kakaoIcon from "@/assets/images/logoKakao.svg";
import naverIcon from "@/assets/images/logoNaver.svg";
import { BASE_URL } from "@/lib/utils";
import { UserType } from "@/lib/types";

interface Prop {
   userType: UserType;
}

// 간편 로그인
export default function EasyLoginForm({ userType }: Prop) {
   const handleGoogleLogin = () => {
      location.href = `${BASE_URL}/auth/google?userType=${userType}`;
   };

   const handlekakaoLogin = () => {
      location.href = `${BASE_URL}/auth/kakao?userType=${userType}`;
   };

   const handlenaverLogin = () => {
      location.href = `${BASE_URL}/auth/naver?userType=${userType}`;
   };

   return (
      <section
         className="my-12 flex flex-col items-center gap-6 lg:my-18"
         aria-labelledby="sns-login-heading"
      >
         <p
            id="sns-login-heading"
            className="text-black-100 text-12-regular lg:text-20-regular"
         >
            SNS 계정으로 간편 가입하기
         </p>
         <div className="flex gap-6 lg:gap-8">
            <figure
               onClick={handleGoogleLogin}
               className="relative h-13 w-13 cursor-pointer lg:h-18 lg:w-18"
               aria-label="구글 계정으로 로그인"
            >
               <Image src={googleIcon} alt="구글 로그인" fill />
            </figure>
            <figure
               onClick={handlekakaoLogin}
               className="relative h-13 w-13 cursor-pointer lg:h-18 lg:w-18"
               aria-label="카카오 계정으로 로그인"
            >
               <Image src={kakaoIcon} alt="카카오 로그인" fill />
            </figure>
            <figure
               onClick={handlenaverLogin}
               className="relative h-13 w-13 cursor-pointer lg:h-18 lg:w-18"
               aria-label="네이버 계정으로 로그인"
            >
               <Image src={naverIcon} alt="네이버 로그인" fill />
            </figure>
         </div>
      </section>
   );
}
