import React from "react";

export default function ClientProfileTitle() {
   return (
      <section>
         <p className="text-black-400 text-18-bold lg:text-32-medium">
            프로필 등록
         </p>
         <p className="text-black-100 text-12-regular lg:text-20-regular">
            추가 정보를 입력하여 회원가입을 완료해주세요.
         </p>
         <hr className="border-line-100 border-b" />
      </section>
   );
}
