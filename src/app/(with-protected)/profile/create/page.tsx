"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import ClientProfileTitle from "@/components/profile/ClientProfileTitle";
import MoverProfileForm from "@/components/profile/MoverProfileForms";
import ClientProfileForm from "../ClientProfileForm";

export default function CreateProfilePage() {
   const { user } = useAuth();

   //일반으로 로그인한 회원의 경우
   if (user?.userType === "client") {
      return (
         <div className="pt-4 pb-10 lg:pt-6">
            <div className="mx-auto flex max-w-82 flex-col gap-4 lg:max-w-160 lg:gap-6">
               <ClientProfileTitle />
               <ClientProfileForm />
            </div>
         </div>
      );
   }

   //기사님으로 로그인한 회원의 경우
   if (user!.userType === "mover") {
      return (
         <>
            <div className="mb-6 flex flex-col gap-4 lg:mb-12 lg:gap-8">
               <div className="text-18-semibold lg:text-32-semibold leading-8">
                  기사님 프로필 등록
               </div>

               <div className="lg:text-20-regular text-12-regular text-black-200 leading-8">
                  추가 정보를 입력하여 회원가입을 완료해주세요
               </div>
            </div>

            <hr className="border-line-100 m-0 border-t p-0" />

            <MoverProfileForm />
         </>
      );
   }

   // 그외 예상치 못한 userType
   return (
      <div className="mt-20 text-center text-gray-500">
         알 수 없는 사용자 유형입니다.
      </div>
   );
}
