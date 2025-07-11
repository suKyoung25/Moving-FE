"use client";

import React, { useActionState, useState } from "react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SolidButton from "../common/buttons/SolidButton";
import Link from "next/link";

import { validateAuthEmail, validateAuthPassword } from "@/lib/validations";
import createMoverLocalLoginAction from "@/lib/actions/auth/create-mover-local-login.action";

export default function MoverLoginForm() {
   // 상태 모음
   const [, formAction, isPending] = useActionState(
      createMoverLocalLoginAction,
      null,
   );

   // 시작하기 버튼 활성화 상태
   const [validity, setValidity] = useState<Record<string, boolean>>({
      email: false,
      password: false,
   });

   const isDisabled =
      isPending || !Object.values(validity).every((v) => v === true);

   // 각 input에 유효성 확인
   const handleValidateChange = (key: string, isValid: boolean) => {
      setValidity((prev) => ({ ...prev, [key]: isValid }));
   };

   return (
      <form action={formAction} className="flex w-full flex-col gap-4">
         <AuthInput
            name="email"
            label="이메일"
            validator={validateAuthEmail}
            type="email"
            placeholder="이메일을 입력해 주세요"
            onValidChange={handleValidateChange}
         />
         <PasswordInput
            name="password"
            validator={validateAuthPassword}
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            onValidChange={handleValidateChange}
         />

         {/* 로그인 버튼 */}
         <section className="mt-4 lg:mt-10">
            <SolidButton disabled={isDisabled}>
               {isPending ? "로딩 중..." : "로그인"}
            </SolidButton>
            <div className="mt-4 flex items-center justify-center gap-1 lg:mt-8 lg:gap-2">
               <p className="text-black-100 text-12-regular lg:text-20-regular">
                  아직 무빙 회원이 아니신가요?
               </p>
               <Link
                  href="/sign-up/mover"
                  className="text-primary-blue-300 text-12-semibold lg:text-20-semibold underline"
               >
                  이메일로 회원가입하기
               </Link>
            </div>
         </section>
      </form>
   );
}
