"use client";

import React from "react";
import Image from "next/image";
import googleIcon from "@/assets/images/logoGoogle.svg";
import kakaoIcon from "@/assets/images/logoKakao.svg";
import naverIcon from "@/assets/images/logoNaver.svg";
import { BASE_URL } from "@/lib/utils";
import { UserType } from "@/lib/types";
import { useTranslations } from "next-intl";

interface Prop {
   userType: UserType;
}

// 간편 로그인
export default function EasyLoginForm({ userType }: Prop) {
   const t = useTranslations("Sign");

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
      <section className="my-12 flex flex-col items-center gap-6 lg:my-18">
         <p className="text-black-100 text-12-regular lg:text-20-regular">
            {t("easyLoginPrompt")}
         </p>
         <div className="flex gap-6 lg:gap-8">
            <figure
               onClick={handleGoogleLogin}
               className="relative h-13 w-13 cursor-pointer lg:h-18 lg:w-18"
            >
               <Image src={googleIcon} alt={t("googleAlt")} fill />
            </figure>
            <figure
               onClick={handlekakaoLogin}
               className="relative h-13 w-13 cursor-pointer lg:h-18 lg:w-18"
            >
               <Image src={kakaoIcon} alt={t("kakaoAlt")} fill />
            </figure>
            <figure
               onClick={handlenaverLogin}
               className="relative h-13 w-13 cursor-pointer lg:h-18 lg:w-18"
            >
               <Image src={naverIcon} alt={t("naverAlt")} fill />
            </figure>
         </div>
      </section>
   );
}
