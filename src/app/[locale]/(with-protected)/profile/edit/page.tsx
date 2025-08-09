"use client";

import ClientProfileTitle from "@/components/domain/profile/ClientProfileTitle";
import ClientProfileUpdateForm from "@/components/domain/profile/ClientProfileUpdateForm";
import MoverProfileUpdateForm from "@/components/domain/profile/MoverProfileUpdateForms";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

export default function EditProfilePage() {
   const t = useTranslations("Profile");

   const { user } = useAuth();

   // ✅ 일반으로 로그인한 회원의 경우
   if (user?.userType === "client") {
      return (
         <>
            <div
               id="client-profile-edit-main"
               role="main"
               tabIndex={-1}
               aria-labelledby="edit-profile-page-title"
               className="pt-4 pb-10 lg:pt-6"
            >
               {/* screen reader 전용 페이지 제목 */}
               <h1 id="edit-profile-page-title" className="sr-only">
                  프로필 수정 페이지
               </h1>

               <div
                  className={
                     user?.provider === "LOCAL"
                        ? "mx-auto max-w-82 lg:max-w-338"
                        : "mx-auto max-w-82 lg:max-w-200"
                  }
               >
                  <ClientProfileTitle type="수정" />
                  <ClientProfileUpdateForm />
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
                  {t("moverProfileEditTitle")}
               </div>

               <div className="lg:text-20-regular text-12-regular text-black-200 leading-8">
                  {t("moverProfileEditDescription")}
               </div>
            </div>

            <hr className="border-line-100 m-0 border-t p-0" />

            <MoverProfileUpdateForm />
         </>
      );
   }
}
