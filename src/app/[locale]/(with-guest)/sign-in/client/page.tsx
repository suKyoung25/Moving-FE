"use client";

import ClientTitle from "@/components/domain/auth/ClientTitle";
import EasyLoginForm from "@/components/domain/auth/EasyLoginForm";
import SignInForm from "@/components/domain/auth/SignInForm";
import { useAuthError } from "@/lib/hooks/useAuthError";

export default function ClientSignInPage() {
   useAuthError();

   return (
      <section
         id="client-signin-main"
         role="main"
         tabIndex={-1}
         aria-labelledby="signin-page-title"
         className="mx-auto mt-18 mb-31 flex w-82 flex-col items-center lg:w-160"
      >
         {/* 본문에는 안 나타나고 읽기 모드일 때 글씨를 읽어줌 */}
         <h1 id="signin-page-title" className="sr-only">
            로그인 페이지
         </h1>

         {/* 제목 + 기사 페이지로 링크 이동 */}
         <ClientTitle type="login" />

         {/* 서식 */}
         <SignInForm userType="client" />

         {/* 간편 회원가입 */}
         <EasyLoginForm userType="client" />
      </section>
   );
}
