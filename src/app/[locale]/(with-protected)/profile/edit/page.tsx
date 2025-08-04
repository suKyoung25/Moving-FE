"use client";

import ToastPopup from "@/components/common/ToastPopup";
import ClientProfileTitle from "@/components/domain/profile/ClientProfileTitle";
import ClientProfileUpdateForm from "@/components/domain/profile/ClientProfileUpdateForm";
import MoverProfileUpdateForm from "@/components/domain/profile/MoverProfileUpdateForms";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function EditProfilePage() {
   const { user } = useAuth();
   const [toast, setToast] = useState<{
      id: number;
      text: string;
      success: boolean;
   } | null>(null);

   // ✅ 일반으로 로그인한 회원의 경우
   if (user?.userType === "client") {
      console.log("toast 값:", toast);
      return (
         <>
            <div className="pt-4 pb-10 lg:pt-6">
               <div
                  className={
                     user?.provider === "LOCAL"
                        ? "mx-auto max-w-82 lg:max-w-338"
                        : "mx-auto max-w-82 lg:max-w-200"
                  }
               >
                  <ClientProfileTitle type="수정" />
                  <ClientProfileUpdateForm setToast={setToast} />
               </div>
            </div>
            {toast && (
               <ToastPopup
                  key={toast.id}
                  text={toast.text}
                  success={toast.success}
               />
            )}
         </>
      );
   }

   //기사님으로 로그인한 회원의 경우
   if (user?.userType === "mover") {
      return (
         <>
            <div className="mb-6 flex flex-col gap-4 lg:mb-12 lg:gap-8">
               <div className="text-18-semibold lg:text-32-semibold leading-8">
                  기사님 프로필 수정
               </div>

               <div className="lg:text-20-regular text-12-regular text-black-200 leading-8">
                  추가 정보를 입력하여 프로필 수정을 완료해주세요
               </div>
            </div>

            <hr className="border-line-100 m-0 border-t p-0" />

            <MoverProfileUpdateForm />
         </>
      );
   }
}
