import React from "react";
import Image from "next/image";
import googleIcon from "@/assets/images/logoGoogle.svg";
import kakaoIcon from "@/assets/images/logoKakao.svg";
import naverIcon from "@/assets/images/logoNaver.svg";

// 간편 로그인
export default function EasyLoginForm() {
   return (
      <section className="my-12 flex flex-col items-center gap-6 lg:my-18">
         <p className="text-black-100 text-12-regular lg:text-20-regular">
            SNS 계정으로 간편 가입하기
         </p>
         <div className="flex gap-6 lg:gap-8">
            <figure className="relative h-13 w-13 lg:h-18 lg:w-18">
               <Image src={googleIcon} alt="구글 로그인" fill />
            </figure>
            <figure className="relative h-13 w-13 lg:h-18 lg:w-18">
               <Image src={kakaoIcon} alt="카카오 로그인" fill />
            </figure>
            <figure className="relative h-13 w-13 lg:h-18 lg:w-18">
               <Image src={naverIcon} alt="네이버 로그인" fill />
            </figure>
         </div>
      </section>
   );
}
