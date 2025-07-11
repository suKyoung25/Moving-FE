"use client";

import { createMoverProfile } from "@/lib/actions/mover/create-mover-profile.action";
import SolidButton from "@/components/common/buttons/SolidButton";
import GeneralInputField from "@/components/profile/GeneralInputField";
import React, { useActionState, useState } from "react";
import ImageInputField from "./ImageInputField";
import ButtonInputField from "./ButtonInputField";
import TextAreaInputField from "./TextAreaInputField";
import {
   validateArea,
   validateCareer,
   validateProfileName,
   validateOnelineIntroduction,
   validateServiceType,
} from "@/lib/validations";

function ProfileForm() {
   const [, formAction, isPending] = useActionState(createMoverProfile, null);

   //주석: 시작하기 버튼 활성화를 위한 상태 관리
   const [fieldValidity, setFieldValidity] = useState<Record<string, boolean>>({
      nickName: false,
      career: false,
      onelineIntroduction: false,
      detailDescription: false,
      serviceType: false,
      area: false,
   });

   //주석: 시작하기 버튼 활성화를 위해 InputField 컴포넌트로 내려줄 함수
   const handleValidityChange = (key: string, isValid: boolean) => {
      setFieldValidity((prev) => ({
         ...prev,
         [key]: isValid,
      }));
   };

   //주석: 시작하기 버튼 활성화
   const isDisabled =
      isPending || !Object.values(fieldValidity).every((v) => v === true);

   return (
      <form action={formAction} className="mt-6 flex w-full flex-col lg:mt-12">
         <div className="flex flex-col lg:flex-row lg:gap-18">
            <div className="flex flex-1 flex-col">
               <ImageInputField name="image" text="프로필 이미지" />

               <hr className="border-line-100 m-0 my-8 hidden border-t p-0 lg:block" />

               <div className="mt-8">
                  <GeneralInputField
                     name="nickName"
                     text="별명"
                     placeholder="사이트에 노출될 이름을 입력해주세요"
                     onValidChange={handleValidityChange}
                     validator={validateProfileName}
                  />
               </div>

               <hr className="border-line-100 m-0 my-8 border-t p-0" />

               <GeneralInputField
                  name="career"
                  text="경력"
                  placeholder="기사님의 경력을 입력해주세요"
                  onValidChange={handleValidityChange}
                  validator={validateCareer}
               />

               <hr className="border-line-100 m-0 my-8 border-t p-0" />

               <GeneralInputField
                  name="onelineIntroduction"
                  text="한 줄 소개"
                  placeholder="한 줄 소개를 입력해주세요"
                  onValidChange={handleValidityChange}
                  validator={validateOnelineIntroduction}
               />

               <hr className="border-line-100 m-0 my-8 border-t p-0 lg:hidden" />
            </div>

            <div className="flex-1">
               <TextAreaInputField
                  name="detailDescription"
                  text="상세 설명"
                  placeholder="상세 내용을 입력해주세요"
                  onValidChange={handleValidityChange}
               />

               <hr className="border-line-100 m-0 my-8 border-t p-0" />

               <ButtonInputField
                  name="serviceType"
                  text="제공 서비스"
                  isServiceType={true}
                  validator={validateServiceType}
                  onValidChange={handleValidityChange}
               />

               <hr className="border-line-100 m-0 my-8 border-t p-0" />

               <ButtonInputField
                  name="area"
                  text="서비스 가능 지역"
                  isArea={true}
                  validator={validateArea}
                  onValidChange={handleValidityChange}
               />
            </div>
         </div>

         <div className="mt-17 lg:pl-185">
            <SolidButton disabled={isDisabled} type="submit">
               {isPending ? "등록 중..." : "시작하기"}
            </SolidButton>
         </div>
      </form>
   );
}

export default ProfileForm;
