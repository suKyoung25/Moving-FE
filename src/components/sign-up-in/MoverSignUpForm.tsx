"use client";

import React, { useActionState, useEffect, useState } from "react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SolidButton from "../common/buttons/SolidButton";
import Link from "next/link";

import {
   validateAuthEmail,
   validateAuthName,
   validateAuthPassword,
   validateAuthPhone,
} from "@/lib/validations";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthValidationResult, User } from "@/lib/types";
import createMoverLocalSignupAction from "@/lib/actions/auth/create-mover-local-signup.action";

export default function MoverSignUpForm() {
   const router = useRouter();
   const { login } = useAuth();

   const [formState, MoverFormAction, isPending] = useActionState(
      createMoverLocalSignupAction,
      null,
   );

   // 입력 값 상태 관리
   const [formValues, setFormValues] = useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
   });

   // //비밀번호 대조 위한 상태 관리
   // const [checkPassword, setCheckPassword] = useState("");

   // const handleCheckPasswordChange = (
   //    e: React.ChangeEvent<HTMLInputElement>,
   // ) => {
   //    setCheckPassword(e.target.value);
   // };

   //시작하기 버튼 활성화 확인
   const [validity, setValidity] = useState<Record<string, boolean>>({
      name: false,
      email: false,
      phone: false,
      password: false,
      passwordConfirmation: false,
   });

   //시작하기 버튼 활성화를 위해 InputField 컴포넌트로 내려줄 함수
   const handleValidityChange = (key: string, isValid: boolean) => {
      setValidity((prev) => ({
         ...prev,
         [key]: isValid,
      }));
   };

   const handleValueChange = (key: string, value: string) => {
      setFormValues((prev) => ({ ...prev, [key]: value }));

      // 오류 값 초기화
      if (formState?.fieldErrors && typeof formState.fieldErrors === "object") {
         const newErrors = { ...formState.fieldErrors };
         delete newErrors[key];
         formState.fieldErrors = newErrors;
      }
   };

   //비밀번호 확인 검증
   const validatePasswordConfirmation = (
      confirmPassword: string,
   ): AuthValidationResult => {
      if (formValues.password !== confirmPassword) {
         return { success: false, message: "비밀번호가 일치하지 않습니다." };
      }

      return { success: true, message: "" };
   };

   const isDisabled =
      isPending || !Object.values(validity).every((v) => v === true);

   //회원가입 성공 시 리다이렉트
   useEffect(() => {
      if (formState?.success && formState.accessToken && formState.user) {
         const rawUser = formState.user as User;

         login(rawUser, formState.accessToken);
         router.push("/profile/create");
      }
   }, [formState, login, router]);

   return (
      <form action={MoverFormAction} className="flex w-full flex-col gap-4">
         <AuthInput
            name="name"
            label="이름"
            validator={validateAuthName}
            type="text"
            placeholder="성함을 입력해 주세요"
            onValidChange={handleValidityChange}
            onValueChange={handleValueChange}
         />
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
         <AuthInput
            name="phone"
            label="전화번호"
            validator={validateAuthPhone}
            type="text"
            placeholder="숫자만 입력해 주세요"
            onValidChange={handleValidityChange}
            onValueChange={handleValueChange}
            serverError={formState?.fieldErrors?.phone}
         />
         <PasswordInput
            name="password"
            validator={validateAuthPassword}
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            onValidChange={handleValidityChange}
            // onChange={handleCheckPasswordChange}
            onValueChange={handleValueChange}
         />
         <PasswordInput
            name="passwordConfirmation"
            validator={validatePasswordConfirmation}
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 한번 입력해 주세요"
            onValidChange={handleValidityChange}
            onValueChange={handleValueChange}
         />

         {/* 회원가입 버튼 */}
         <section className="mt-4 lg:mt-10">
            <SolidButton type="submit" disabled={isDisabled}>
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
