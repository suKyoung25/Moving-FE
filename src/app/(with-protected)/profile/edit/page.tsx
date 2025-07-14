"use client";

import { useAuth } from "@/context/AuthContext";

export default function EditProfilePage() {
   const { user } = useAuth();

   //일반으로 로그인한 회원의 경우
   if (user?.userType === "client") {
      return; //클라이언트 UI
   }

   //기사님으로 로그인한 회원의 경우
   if (user?.userType === "mover") {
      return; //무버 UI
   }
}
