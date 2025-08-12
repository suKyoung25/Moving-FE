"use client";

import React from "react";
import { useUserWithdrawForm } from "@/lib/hooks/useUserWithdrawForm";
import SolidButton from "./SolidButton";
import OutlinedButton from "./OutlinedButton";
import PasswordInput from "../domain/auth/PasswordInput";
import GeneralInputField from "../domain/profile/GeneralInputField";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

export function UserWithdrawal({ onClose }: { onClose: () => void }) {
   const t = useTranslations("Header");
   const { user } = useAuth();

   const { register, errors, isValid, isLoading, handleSubmit, onSubmit } =
      useUserWithdrawForm(onClose);

   if (!user) return null;

   const userType = user.userType!;
   const userProvider = user.provider!;
   const isLocal = userProvider === "LOCAL";

   return (
      <div className="flex h-full flex-col p-4">
         <h2 className="text-18-semibold lg:text-22-semibold">회원탈퇴</h2>

         {/* 내용 */}
         <form
            onSubmit={handleSubmit((data) => onSubmit(userType)(data))}
            className="flex h-full flex-col justify-between py-4"
         >
            <div className="">
               {isLocal ? (
                  <>
                     <PasswordInput
                        name="password"
                        placeholder={t("passwordPlaceholder")}
                        register={register}
                        error={errors.password?.message}
                     />
                  </>
               ) : (
                  <>
                     <GeneralInputField
                        name="confirmMessage"
                        text={t("confirmMessageLabel")}
                        placeholder={t("confirmMessagePlaceholder")}
                        register={register}
                        error={errors.confirmMessage}
                     />
                  </>
               )}
            </div>

            {/* 하단 버튼 */}
            <div className="flex flex-col gap-3">
               <OutlinedButton onClick={onClose} className="flex-1">
                  {t("close")}
               </OutlinedButton>

               <SolidButton
                  disabled={!isValid || isLoading}
                  type="submit"
                  className="flex-1"
               >
                  {isLoading ? t("withdrawing") : t("withdrawButton")}
               </SolidButton>
            </div>
         </form>
      </div>
   );
}
