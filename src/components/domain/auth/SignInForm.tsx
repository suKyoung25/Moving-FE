"use client";

import React from "react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SolidButton from "../../common/SolidButton";
import Link from "next/link";
import useSignInForm from "@/lib/hooks/useSignInForm";
import { UserType } from "@/lib/types";

interface Prop {
   userType: UserType;
}

export default function SignInForm({ userType }: Prop) {
   // ✅ 함수 모음
   const {
      register,
      errors,
      isValid,
      onSubmit,
      isLoading,
      handleSubmit,
      isLoginBlock,
   } = useSignInForm();

   return (
      <form
         onSubmit={handleSubmit((data) => onSubmit(userType)(data))}
         className="flex w-full flex-col"
         aria-labelledby="login-form-heading"
      >
         <h2 id="login-form-heading" className="sr-only">
            로그인 입력 폼
         </h2>

         {/* ✅ Input */}
         <AuthInput
            type="email"
            name="email"
            label="이메일"
            placeholder="이메일을 입력해 주세요"
            register={register}
            error={errors.email?.message}
         />
         <PasswordInput
            name="password"
            label="비밀번호"
            placeholder="비밀번호를 입력해 주세요"
            register={register}
            error={errors.password?.message}
         />

         {/* ✅ 로그인 버튼 */}
         <section className="mt-4 lg:mt-10">
            <SolidButton
               type="submit"
               disabled={!isValid || isLoading || isLoginBlock}
               aria-disabled={!isValid || isLoading || isLoginBlock}
            >
               {isLoading ? "로딩 중..." : "로그인"}
            </SolidButton>
            <div className="mt-4 flex items-center justify-center gap-1 lg:mt-8 lg:gap-2">
               <p className="text-black-100 text-12-regular lg:text-20-regular">
                  아직 무빙 회원이 아니신가요?
               </p>
               <Link
                  href={`/sign-up/${userType}`}
                  className="text-primary-blue-300 text-12-semibold lg:text-20-semibold underline"
                  aria-label="회원가입 페이지로 이동"
               >
                  이메일로 회원가입하기
               </Link>
            </div>
         </section>
      </form>
   );
}
