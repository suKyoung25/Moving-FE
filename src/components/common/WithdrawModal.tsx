"use client";

import React from "react";
import { useMoverWithdrawForm } from "@/lib/hooks/useMoverWithdrawForm";
import SolidButton from "./SolidButton";
import OutlinedButton from "./OutlinedButton";
import PasswordInput from "../domain/auth/PasswordInput";
import GeneralInputField from "../domain/profile/GeneralInputField";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

interface Props {
   onClose: () => void;
}

export default function WithdrawModal({ onClose }: Props) {
   const t = useTranslations("Header");
   const { user } = useAuth();

   if (!user) return null;
   const userType = user.userType!;
   const userProvider = user.provider!;

   // provider가 LOCAL / SOCIAL인지에 따라 UI 분기처리
   const isLocal = userProvider === "LOCAL";

   console.log("userProvider", userProvider); //디버깅

   const { register, errors, isValid, isLoading, handleSubmit, onSubmit } =
      useMoverWithdrawForm(onClose);

   return (
      <form
         onSubmit={handleSubmit((data) => onSubmit(userType)(data))}
         className="flex w-full flex-col"
      >
         <div
            className="bg-black-100/50 fixed inset-0 z-50 flex items-center justify-center"
            onMouseDown={onClose} // 바깥 누르면 닫기
         >
            <div
               className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
               onMouseDown={(e) => e.stopPropagation()} // 내부 클릭 시 닫히는 거 막기
            >
               {isLocal ? (
                  <>
                     <h2 className="mb-4 text-lg font-semibold">
                        {/* TODO: 추후 확인 탈퇴하시려면 비밀번호를 입력해주세요 */}
                        {t("enterPasswordPrompt")}
                     </h2>

                     <PasswordInput
                        name="password"
                        placeholder={t("passwordPlaceholder")}
                        register={register}
                        error={errors.password?.message}
                     />
                  </>
               ) : (
                  <>
                     <h2 className="mb-4 text-lg font-semibold">
                        탈퇴하시려면 &quot;회원 탈퇴&quot;를 입력해주세요
                     </h2>

                     <GeneralInputField
                        name="confirmMessage"
                        text="확인 메세지"
                        placeholder="'회원 탈퇴'를 정확히 입력해주세요"
                        register={register}
                        error={errors.confirmMessage}
                     />
                  </>
               )}

               <div className="mt-4 flex justify-end gap-2">
                  <OutlinedButton onClick={onClose}>
                     {t("close")}
                  </OutlinedButton>

                  <SolidButton disabled={!isValid || isLoading} type="submit">
                     {isLoading ? t("withdrawing") : t("withdrawButton")}
                  </SolidButton>
               </div>
            </div>
         </div>
      </form>
   );
}
