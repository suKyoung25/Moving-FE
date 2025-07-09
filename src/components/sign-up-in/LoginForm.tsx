"use client";

import React, { useActionState, useState } from "react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SolidButton from "../common/buttons/SolidButton";
import Link from "next/link";

import { validateAuthEmail, validateAuthPassword } from "@/lib/validations";
import createClientLocalLoginAction from "@/lib/actions/auth/create-client-local-login.action";

export default function LoginForm() {
  // 상태 모음
  const [, formAction, isPending] = useActionState(
    createClientLocalLoginAction,
    null
  );

  // 입력 값 상태 관리
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  // 1. 유효성 검사 : 시작하기 버튼 활성화 여부
  const [validity, setValidity] = useState<Record<string, boolean>>({
    email: false,
    password: false,
  });

  // 2.
  const handleValidatyChange = (key: string, isValid: boolean) => {
    setValidity((prev) => ({ ...prev, [key]: isValid }));
  };

  // 입력 값 변경
  const handleValueChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  // 3.
  const isDisabled =
    isPending || !Object.values(validity).every((v) => v === true);

  // 본문
  return (
    <form action={formAction} className="flex flex-col gap-4 w-full">
      <AuthInput
        name="email"
        label="이메일"
        validator={validateAuthEmail}
        type="email"
        placeholder="이메일을 입력해 주세요"
        onValidChange={handleValidatyChange}
        onValueChange={handleValueChange}
      />
      <PasswordInput
        name="password"
        validator={validateAuthPassword}
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력해 주세요"
        onValidChange={handleValidatyChange}
        onValueChange={handleValueChange}
      />

      {/* 로그인 버튼 */}
      <section className="mt-4 lg:mt-10">
        <SolidButton disabled={isDisabled}>
          {isPending ? "로딩 중..." : "로그인"}
        </SolidButton>
        <div className="flex mt-4 lg:mt-8 justify-center items-center gap-1 lg:gap-2">
          <p className="text-black-100 text-12-regular lg:text-20-regular">
            아직 무빙 회원이 아니신가요?
          </p>
          <Link
            href="/sign-up/client"
            className="text-primary-blue-300 underline text-12-semibold lg:text-20-semibold"
          >
            이메일로 회원가입하기
          </Link>
        </div>
      </section>
    </form>
  );
}
