"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import ClientProfileTitle from "@/components/domain/profile/ClientProfileTitle";
import ClientProfilePostForm from "@/components/domain/profile/ClientProfilePostForm";
import MoverProfilePostForm from "@/components/domain/profile/MoverProfilePostForms";
import { useTranslations } from "next-intl";

export default function CreateProfilePage() {
   const t = useTranslations("Profile");

   const { user } = useAuth();

   // ✅ 일반으로 로그인한 회원의 경우
   if (user?.userType === "client") {
      return (
         <>
            <div
               id="client-profile-create-main"
               role="main"
               tabIndex={-1}
               aria-labelledby="create-profile-page-title"
               className="pt-4 pb-10 lg:pt-6"
            >
               {/* screen reader 전용 페이지 제목 */}
               <h1 id="create-profile-page-title" className="sr-only">
                  프로필 등록 페이지
               </h1>

               <div className="mx-auto max-w-82 lg:max-w-160">
                  <ClientProfileTitle type="생성" />
                  <ClientProfilePostForm />
               </div>
            </div>
         </>
      );
   }

   //기사님으로 로그인한 회원의 경우
   if (user?.userType === "mover") {
      return (
         <>
            <div className="mb-6 flex flex-col gap-4 lg:mb-12 lg:gap-8">
               <div className="text-18-semibold lg:text-32-semibold leading-8">
                  {t("moverProfileTitle")}
               </div>

               <div className="lg:text-20-regular text-12-regular text-black-200 leading-8">
                  {t("moverProfileDescription")}
               </div>
            </div>

            <hr className="border-line-100 m-0 border-t p-0" />

            <MoverProfilePostForm />
         </>
      );
   }

   // 그외 예상치 못한 userType
   return (
      <div className="mt-20 text-center text-gray-500">
         {t("unknownUserType")}
      </div>
   );
}
