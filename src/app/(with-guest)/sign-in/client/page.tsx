"use client";

import AuthInput from "../../_component/AuthInput";
import PasswordInput from "../../_component/PasswordInput";
import SolidButton from "@/components/common/buttons/SolidButton";
import Link from "next/link";
import useLoginForm from "@/lib/hooks/useLoginForm";
import ClientTitle from "../../_component/ClientTitle";
import EasyLoginForm from "../../_component/EasyLoginForm";

export default function ClientSignInPage() {
  const { form, errors, handleChange } = useLoginForm();

  return (
    <section className="mt-18 mb-31 flex flex-col items-center w-82 lg:w-160 mx-auto">
      {/* 제목 + 기사 페이지로 링크 이동 */}
      <ClientTitle type="login" />

      {/* 서식 */}
      <form className="flex flex-col gap-4 w-full">
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

        {/* 회원가입 버튼 */}
        <section className="mt-4 lg:mt-10">
          <SolidButton disabled>로그인</SolidButton>
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

      {/* 간편 회원가입 */}
      <EasyLoginForm />
    </section>
  );
}
