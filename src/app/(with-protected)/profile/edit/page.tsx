"use client";

import ClientProfileTitle from "@/components/domain/profile/ClientProfileTitle";
// import ClientProfileUpdateForm from "@/components/profile/ClientProfileUpdateForm";
import { useAuth } from "@/context/AuthContext";

export default function EditProfilePage() {
   const { user } = useAuth();

   //일반으로 로그인한 회원의 경우
   if (user?.userType === "client") {
      return (
         <div className="pt-4 pb-10 lg:pt-6">
            <div className="mx-auto max-w-82 lg:max-w-160">
               <ClientProfileTitle type="수정" />
               {/* <ClientProfileUpdateForm /> */}
            </div>
         </div>
      );
   }

   //기사님으로 로그인한 회원의 경우
   if (user?.userType === "mover") {
      return; //무버 UI
   }
}
