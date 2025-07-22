"use client";

import React from "react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SolidButton from "@/components/common/SolidButton";
import Link from "next/link";
import useSignUpForm from "@/lib/hooks/useSignUpForm";
import { UserType } from "@/lib/types";

interface Prop {
   userType: UserType;
}

// 여기서부터 시작
export default function SignUpForm({ userType }: Prop) {
   const { register, errors, isValid, isLoading, handleSubmit, onSubmit } =
      useSignUpForm();

   // ✅ 본문
   return (
      <form
         onSubmit={handleSubmit((data) => onSubmit(userType)(data))}
         className="flex w-full flex-col gap-4"
      >
         <AuthInput
            type="text"
            name="name"
            label="이름"
            placeholder="성함을 입력해 주세요"
            register={register}
            error={errors.name?.message}
         />
         <AuthInput
            type="email"
            name="email"
            label="이메일"
            placeholder="이메일을 입력해 주세요"
            register={register}
            error={errors.email?.message}
         />
         <AuthInput
            type="text"
            name="phone"
            label="전화번호"
            placeholder="숫자만 입력해 주세요"
            register={register}
            error={errors.phone?.message}
         />
         <PasswordInput
            name="password"
            label="비밀번호"
            placeholder="비밀번호를 입력해 주세요"
            register={register}
            error={errors.password?.message}
         />
         <PasswordInput
            name="passwordConfirmation"
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 한번 입력해 주세요"
            register={register}
            error={errors.passwordConfirmation?.message}
         />

         {/* 회원가입 버튼 */}
         <section className="mt-4 lg:mt-10">
            <SolidButton type="submit" disabled={!isValid || isLoading}>
               {isLoading ? "로딩 중..." : "시작하기"}
            </SolidButton>
            <div className="mt-4 flex items-center justify-center gap-1 lg:mt-8 lg:gap-2">
               <p className="text-black-100 text-12-regular lg:text-20-regular">
                  이미 무빙 회원이신가요?
               </p>
               <Link
                  href="/sign-in/client"
                  className="text-primary-blue-300 text-12-semibold lg:text-20-semibold underline"
               >
                  로그인
               </Link>
            </div>
         </section>
      </form>
   );
}
