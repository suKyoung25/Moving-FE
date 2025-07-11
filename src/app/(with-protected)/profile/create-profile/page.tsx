// 프로필 등록(일반 유저 + 사장님) 추후 데이터 불러올 때 분기 처리 예정
import ProfileForm from "@/components/profile/ProfileForm";
import React from "react";

function MoverProfilePage() {
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

         <ProfileForm />
      </>
   );
}

export default MoverProfilePage;
