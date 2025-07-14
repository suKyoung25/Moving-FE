"use client";

import React, { useActionState, useEffect, useState } from "react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SolidButton from "../common/buttons/SolidButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { validateAuthEmail, validateAuthPassword } from "@/lib/validations";
import createClientLocalLoginAction from "@/lib/actions/auth/create-client-local-login.action";

export default function ClientLoginForm() {
   // 상태 모음
   const router = useRouter();
   const { login } = useAuth();

   const [formState, formAction, isPending] = useActionState(
      createClientLocalLoginAction,
      null,
   );

   // ✅ 유효성 검사: 1. 시작하기 버튼 활성화 여부
   const [validity, setValidity] = useState<Record<string, boolean>>({
      email: false,
      password: false,
   });

   // 2.
   const handleValidityChange = (key: string, isValid: boolean) => {
      setValidity((prev) => ({ ...prev, [key]: isValid }));
   };

   // ✅ 입력 값 변경 시 서버 오류 제거
   const handleValueChange = (key: string) => {
      if (formState?.fieldErrors && typeof formState.fieldErrors === "object") {
         const newErrors = { ...formState.fieldErrors };
         delete newErrors[key];
         formState.fieldErrors = newErrors;
      }
   };

   // 3. 버튼 활성화 조건
   const isFormValid = Object.values(validity).every((v) => v === true);
   const isDisabled = isPending || !isFormValid;

   // ✅ 로그인 성공하면 페이지 이동
   useEffect(() => {
      if (formState?.success && formState.user && formState?.accessToken) {
         login(formState.user, formState.accessToken);
         router.push("/mover-search");
      }
   }, [formState, login, router]);

   // 본문
   return (
      <form action={formAction} className="flex w-full flex-col gap-4">
         <AuthInput
            name="email"
            label="이메일"
            validator={validateAuthEmail}
            type="email"
            placeholder="이메일을 입력해 주세요"
            onValidChange={handleValidityChange}
            onValueChange={handleValueChange}
            serverError={formState?.fieldErrors?.email}
         />

         <PasswordInput
            name="password"
            validator={validateAuthPassword}
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            onValidChange={handleValidityChange}
            onValueChange={handleValueChange}
            serverError={formState?.fieldErrors?.password}
         />
         {/* 로그인 버튼 */}
         <section className="mt-4 lg:mt-10">
            <SolidButton disabled={isDisabled} type="submit">
               {isPending ? "로딩 중..." : "로그인"}
            </SolidButton>
            <div className="mt-4 flex items-center justify-center gap-1 lg:mt-8 lg:gap-2">
               <p className="text-black-100 text-12-regular lg:text-20-regular">
                  아직 무빙 회원이 아니신가요?
               </p>
               <Link
                  href="/sign-up/client"
                  className="text-primary-blue-300 text-12-semibold lg:text-20-semibold underline"
               >
                  이메일로 회원가입하기
               </Link>
            </div>
         </section>
      </form>
   );
}
