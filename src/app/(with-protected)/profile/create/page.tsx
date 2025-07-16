"use client";

import MoverProfileForm from "@/components/profile/MoverProfileForms";
import { useAuth } from "@/context/AuthContext";

export default function CreateProfilePage() {
   const { user } = useAuth();

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
