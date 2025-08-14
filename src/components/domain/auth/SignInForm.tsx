"use client";

import React from "react";
import AuthInput from "./AuthInput";
import PasswordInput from "./PasswordInput";
import SolidButton from "../../common/SolidButton";
import { Link } from "@/i18n/navigation";
import useSignInForm from "@/lib/hooks/useSignInForm";
import { UserType } from "@/lib/types";
import { useTranslations } from "next-intl";

interface Prop {
   userType: UserType;
}

export default function SignInForm({ userType }: Prop) {
   const t = useTranslations("Sign");
   // ✅ 함수 모음
   const {
      register,
      errors,
      isValid,
      onSubmit,
      isLoading,
      handleSubmit,
      isLoginBlock,
   } = useSignInForm();

   return (
      <form
         onSubmit={handleSubmit((data) => onSubmit(userType)(data))}
         className="flex w-full flex-col"
         aria-labelledby="login-form-heading"
      >
         <h2 id="login-form-heading" className="sr-only">
            {t("loginFormHeading")}
         </h2>

         {/* ✅ Input */}
         <AuthInput
            type="email"
            name="email"
            label={t("emailLabel")}
            placeholder={t("emailPlaceholder")}
            register={register}
            error={errors.email?.message}
         />
         <PasswordInput
            name="password"
            label={t("passwordLabel")}
            placeholder={t("passwordPlaceholder")}
            register={register}
            error={errors.password?.message}
         />

         {/* ✅ 로그인 버튼 */}
         <section className="mt-4 lg:mt-10">
            <SolidButton
               type="submit"
               disabled={!isValid || isLoading || isLoginBlock}
               aria-disabled={!isValid || isLoading || isLoginBlock}
            >
               {isLoading ? t("loadingText") : t("loginButton")}
            </SolidButton>
            <div className="mt-4 flex items-center justify-center gap-1 lg:mt-8 lg:gap-2">
               <p className="text-black-100 text-12-regular lg:text-20-regular">
                  {t("signupPrompt")}
               </p>
               <Link
                  href={`/sign-up/${userType}`}
                  className="text-primary-blue-300 text-12-semibold lg:text-20-semibold underline"
                  aria-label={t("signupPageAria")}
               >
                  {t("signupLinkText")}
               </Link>
            </div>
         </section>
      </form>
   );
}
