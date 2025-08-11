"use client";

import React from "react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SolidButton from "@/components/common/SolidButton";
import Link from "next/link";
import useSignUpForm from "@/lib/hooks/useSignUpForm";
import { UserType } from "@/lib/types";
import { SignUpFormValues } from "@/lib/schemas";
import { useTranslations } from "next-intl";

interface Prop {
   userType: UserType;
}

export default function SignUpForm({ userType }: Prop) {
   const t = useTranslations("Sign");
   // ✅ 함수 모음
   const { register, errors, isValid, isLoading, handleSubmit, onSubmit } =
      useSignUpForm();

   return (
      <form
         onSubmit={handleSubmit((data) => onSubmit(userType)(data))}
         aria-labelledby="signup-form"
         className="flex w-full flex-col"
         aria-labelledby="signup-form-heading"
      >
         <h2 id="signup-form-heading" className="sr-only">
            회원가입 입력 폼
         </h2>

         <AuthInput<SignUpFormValues>
            type="text"
            name="name"
            label={t("nameLabel")}
            placeholder={t("namePlaceholder")}
            register={register}
            error={errors.name?.message}
         />
         <AuthInput<SignUpFormValues>
            type="email"
            name="email"
            label={t("emailLabel")}
            placeholder={t("emailPlaceholder")}
            register={register}
            error={errors.email?.message}
         />
         <AuthInput<SignUpFormValues>
            type="text"
            name="phone"
            label={t("phoneLabel")}
            placeholder={t("phonePlaceholder")}
            register={register}
            error={errors.phone?.message}
         />
         <PasswordInput<SignUpFormValues>
            name="password"
            label={t("passwordLabel")}
            placeholder={t("passwordPlaceholder")}
            register={register}
            error={errors.password?.message}
         />
         <PasswordInput<SignUpFormValues>
            name="passwordConfirmation"
            label={t("passwordConfirmationLabel")}
            placeholder={t("passwordConfirmationPlaceholder")}
            register={register}
            error={errors.passwordConfirmation?.message}
         />
         {/* ✅ 회원가입 버튼 */}
         <section className="mt-4 lg:mt-10">
            <SolidButton type="submit" disabled={!isValid || isLoading}>
               {isLoading ? t("loadingText") : t("signUpButton")}
            </SolidButton>
            <div
               className="mt-4 flex items-center justify-center gap-1 lg:mt-8 lg:gap-2"
               role="group"
               aria-label="이미 가입한 사용자 안내"
            >
               <p className="text-black-100 text-12-regular lg:text-20-regular">
                  {t("alreadyMemberText")}
               </p>
               <Link
                  href={`/sign-in/${userType}`}
                  className="text-primary-blue-300 text-12-semibold lg:text-20-semibold underline"
                  aria-label="로그인 페이지로 이동"
               >
                  {t("loginLinkText")}
               </Link>
            </div>
         </section>
      </form>
   );
}
