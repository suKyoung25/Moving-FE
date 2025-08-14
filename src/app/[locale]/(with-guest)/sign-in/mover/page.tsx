"use client";

import EasyLoginForm from "@/components/domain/auth/EasyLoginForm";
import MoverTitle from "@/components/domain/auth/MoverTitle";
import SignInForm from "@/components/domain/auth/SignInForm";
import { useAuthError } from "@/lib/hooks/useAuthError";
import { useTranslations } from "next-intl";

// 기사님 로그인 페이지
export default function MoverSignInPage() {
   const t = useTranslations("Sign");
   useAuthError();

   return (
      <section
         id="mover-signin-main"
         role="main"
         tabIndex={-1}
         aria-labelledby="signin-page-title"
         className="mx-auto mt-18 mb-31 flex w-82 flex-col items-center lg:w-160"
      >
         {/* 본문에는 안 나타나고 읽기 모드일 때 글씨를 읽어줌 */}
         <h1 id="signin-page-title" className="sr-only">
            {t("pageTitle")}
         </h1>

         {/* 제목 + 일반유저 페이지로 링크 이동 */}
         <MoverTitle type="login" />

         {/* 서식 */}
         <SignInForm userType="mover" />

         {/* 간편 회원가입 */}
         <EasyLoginForm userType="mover" />
      </section>
   );
}
