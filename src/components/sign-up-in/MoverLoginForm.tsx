"use client";

import React, { useActionState, useEffect, useState } from "react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SolidButton from "../common/buttons/SolidButton";
import Link from "next/link";

import { validateAuthEmail, validateAuthPassword } from "@/lib/validations";
import createMoverLocalLoginAction from "@/lib/actions/auth/create-mover-local-login.action";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/lib/types";

export default function MoverLoginForm() {
   const router = useRouter();
   const { login } = useAuth();

   const [formState, moverFormAction, isPending] = useActionState(
      createMoverLocalLoginAction,
      null,
   );

   // 유효성 검사: 시작하기 버튼 활성화 여부
   const [validity, setValidity] = useState<Record<string, boolean>>({
      email: false,
      password: false,
   });

   // 각 input에 유효성 확인
   const handleValidateChange = (key: string, isValid: boolean) => {
      setValidity((prev) => ({ ...prev, [key]: isValid }));
   };

   //입력 값 변경 시 서버 오류 제거
   const handleValueChange = (key: string) => {
      if (formState?.fieldErrors && typeof formState.fieldErrors === "object") {
         const newErrors = { ...formState.fieldErrors };
         delete newErrors[key];
         formState.fieldErrors = newErrors;
      }
   };

   //버튼 활성화 조건
   const isDisabled =
      isPending || !Object.values(validity).every((v) => v === true);

   //로그인 성공 시 프로필 생성 페이지로 리다이렉트
   useEffect(() => {
      if (formState?.success && formState.user && formState?.accessToken) {
         const rawUser = formState.user as User;

         login(rawUser, formState.accessToken);
         router.push("/profile/create");
      }
   }, [formState, login, router]);

   return (
      <form action={moverFormAction} className="flex w-full flex-col gap-4">
         <AuthInput
            name="email"
            label="이메일"
            validator={validateAuthEmail}
            type="email"
            placeholder="이메일을 입력해 주세요"
            onValidChange={handleValidateChange}
            onValueChange={handleValueChange}
            serverError={formState?.fieldErrors?.email}
         />
         <PasswordInput
            name="password"
            validator={validateAuthPassword}
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            onValidChange={handleValidateChange}
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
