import React from "react";
import { useMoverWithdrawForm } from "@/lib/hooks/useMoverWithdrawForm";
import SolidButton from "./SolidButton";
import OutlinedButton from "./OutlinedButton";
import { UserType } from "@/lib/types";
import PasswordInput from "../domain/auth/PasswordInput";

interface Props {
   onClose: () => void;
   userType: UserType;
}

export default function WithdrawModal({ onClose, userType }: Props) {
   if (typeof window === "undefined") return null;

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
               <h2 className="mb-4 text-lg font-semibold">
                  탈퇴하시려면 비밀번호를 입력해주세요
               </h2>

               <PasswordInput
                  name="password"
                  placeholder="비밀번호를 입력해 주세요"
                  register={register}
                  error={errors.password?.message}
               />
               <div className="flex justify-end gap-2">
                  <OutlinedButton onClick={onClose}>닫기</OutlinedButton>

                  <SolidButton disabled={!isValid || isLoading} type="submit">
                     {isLoading ? "탈퇴 중..." : "탈퇴하기"}
                  </SolidButton>
               </div>
            </div>
         </div>
      </form>
   );
}
