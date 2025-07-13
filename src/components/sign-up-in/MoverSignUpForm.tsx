"use client";

import React, { useActionState, useState } from "react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SolidButton from "../common/buttons/SolidButton";
import Link from "next/link";

import {
   validateAuthCheckPassword,
   validateAuthEmail,
   validateAuthName,
   validateAuthPassword,
   validateAuthPhone,
} from "@/lib/validations";
import createMoverLocalSignupAction from "@/lib/actions/auth/create-mover-local-signup.action";

export default function MoverSignUpForm() {
   const [, formAction, isPending] = useActionState(
      createMoverLocalSignupAction,
      null,
   );

   //비밀번호 대조 위한 상태 관리
   const [checkPassword, setCheckPassword] = useState("");

   const handleCheckPasswordChange = (
      e: React.ChangeEvent<HTMLInputElement>,
   ) => {
      setCheckPassword(e.target.value);
   };

   //시작하기 버튼 활성화 확인
   const [validity, setValidity] = useState<Record<string, boolean>>({
      name: false,
      email: false,
      phoneNumber: false,
      password: false,
      passwordConfirmation: false,
   });

   //시작하기 버튼 활성화를 위해 InputField 컴포넌트로 내려줄 함수
   const handleValidatyChange = (key: string, isValid: boolean) => {
      setValidity((prev) => ({
         ...prev,
         [key]: isValid,
      }));
   };

   const isDisabled =
      isPending || !Object.values(validity).every((v) => v === true);

   return (
      <form action={formAction} className="flex w-full flex-col gap-4">
         <AuthInput
            name="name"
            label="이름"
            validator={validateAuthName}
            type="text"
            placeholder="성함을 입력해 주세요"
            onValidChange={handleValidatyChange}
         />
         <AuthInput
            name="email"
            label="이메일"
            validator={validateAuthEmail}
            type="email"
            placeholder="이메일을 입력해 주세요"
            onValidChange={handleValidatyChange}
         />
         <AuthInput
            name="phoneNumber"
            label="전화번호"
            validator={validateAuthPhone}
            type="text"
            placeholder="숫자만 입력해 주세요"
            onValidChange={handleValidatyChange}
         />
         <PasswordInput
            name="password"
            validator={validateAuthPassword}
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            onValidChange={handleValidatyChange}
            onChange={handleCheckPasswordChange}
         />
         <PasswordInput
            name="passwordConfirmation"
            validator={(val) => validateAuthCheckPassword(val, checkPassword)}
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 한번 입력해 주세요"
            onValidChange={handleValidatyChange}
         />

         {/* 회원가입 버튼 */}
         <section className="mt-4 lg:mt-10">
            <SolidButton disabled={isDisabled}>
               {isPending ? "로딩 중..." : "시작하기"}
            </SolidButton>
            <div className="mt-4 flex items-center justify-center gap-1 lg:mt-8 lg:gap-2">
               <p className="text-black-100 text-12-regular lg:text-20-regular">
                  이미 무빙 회원이신가요?
               </p>
               <Link
                  href="/sign-in/mover"
                  className="text-primary-blue-300 text-12-semibold lg:text-20-semibold underline"
               >
                  로그인
               </Link>
            </div>
         </section>
      </form>
   );
}
