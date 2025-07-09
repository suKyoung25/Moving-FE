"use client";

import AuthInput from "../../_component/AuthInput";
import PasswordInput from "../../_component/PasswordInput";
import SolidButton from "@/components/common/buttons/SolidButton";
import Link from "next/link";
import useSignUpForm from "@/lib/hooks/useSignUpForm";
import ClientTitle from "../../_component/ClientTitle";
import EasyLoginForm from "../../_component/EasyLoginForm";

export default function ClientSignUpPage() {
  const { form, errors, handleChange } = useSignUpForm();

  return (
    <section className="mt-18 mb-31 flex flex-col items-center w-82 lg:w-160 mx-auto">
      {/* 제목 + 기사 페이지로 링크 이동 */}
      <ClientTitle type="signup" />

      {/* 서식 */}
      <form className="flex flex-col gap-4 w-full">
        <AuthInput
          id="nickname"
          name="nickname"
          label="이름"
          value={form.nickname}
          type="text"
          placeholder="성함을 입력해 주세요"
          onChange={handleChange}
          error={errors.nickname}
        />
        <AuthInput
          id="email"
          name="email"
          label="이메일"
          value={form.email}
          type="email"
          placeholder="이메일을 입력해 주세요"
          onChange={handleChange}
          error={errors.email}
        />
        <AuthInput
          id="phoneNumber"
          name="phoneNumber"
          label="전화번호"
          value={form.phoneNumber}
          type="text"
          placeholder="숫자만 입력해 주세요"
          onChange={handleChange}
          error={errors.phoneNumber}
        />
        <PasswordInput
          id="password"
          name="password"
          value={form.password}
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          onChange={handleChange}
          error={errors.password}
        />
        <PasswordInput
          id="passwordConfirmation"
          name="passwordConfirmation"
          value={form.passwordConfirmation}
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 다시 한번 입력해 주세요"
          onChange={handleChange}
          error={errors.passwordConfirmation}
        />

        {/* 회원가입 버튼 */}
        <section className="mt-4 lg:mt-10">
          <SolidButton disabled>시작하기</SolidButton>
          <div className="flex mt-4 lg:mt-8 justify-center items-center gap-1 lg:gap-2">
            <p className="text-black-100 text-12-regular lg:text-20-regular">
              이미 무빙 회원이신가요?
            </p>
            <Link
              href="/sign-in/client"
              className="text-primary-blue-300 underline text-12-semibold lg:text-20-semibold"
            >
              로그인
            </Link>
          </div>
        </section>
      </form>

      {/* 간편 회원가입 */}
      <EasyLoginForm />
    </section>
  );
}
