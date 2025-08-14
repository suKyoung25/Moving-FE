"use client";

import EasyLoginForm from "@/components/domain/auth/EasyLoginForm";
import MoverTitle from "@/components/domain/auth/MoverTitle";
import SignUpForm from "@/components/domain/auth/SignUpForm";
import { useAuthError } from "@/lib/hooks/useAuthError";
import { useTranslations } from "next-intl";

export default function MoverSignUpPage() {
   const t = useTranslations("Sign");
   useAuthError();

   return (
      <section
         id="mover-signup-main"
         role="main"
         tabIndex={-1}
         aria-labelledby="signup-page-title"
         className="mx-auto mt-18 mb-31 flex w-82 flex-col items-center lg:w-160"
      >
         {/* screen reader 전용 페이지 제목 */}
         <h1 id="signup-page-title" className="sr-only">
            {t("moverSignupPageTitle")}
         </h1>

         {/* 제목 + 일반유저 페이지로 링크 이동 */}
         <MoverTitle type="signup" />

         {/* 서식 */}
         <SignUpForm userType="mover" />

         {/* 간편 회원가입 */}
         <EasyLoginForm userType="mover" />
      </section>
   );
}
