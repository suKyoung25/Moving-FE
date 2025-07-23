"use client";

import React, { useEffect } from "react";
import ImageInputField from "./ImageInputField";
import GeneralInputField from "./GeneralInputField";
import TextAreaInputField from "./TextAreaInputField";
import ButtonInputField from "./ButtonInputField";
import SolidButton from "@/components/common/SolidButton";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import useMoverProfileUpdateForm from "@/lib/hooks/useMoverProfileUpdateForm";

function MoverProfileUpdateForm() {
   const { user } = useAuth();
   const router = useRouter();

   if (!user) return null;

   //프로필 등록을 안했으면 등록으로 리다이렉트
   useEffect(() => {
      if (!user.isProfileCompleted) {
         alert("프로필 등록을 먼저 해주세요");
         router.push("/profile/create");
      }
   }, [user]);

   const {
      register,
      control,
      errors,
      isValid,
      isLoading,
      handleSubmit,
      onSubmit,
   } = useMoverProfileUpdateForm();

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="mt-6 flex w-full flex-col lg:mt-12"
      >
         <div className="flex flex-col lg:flex-row lg:gap-18">
            <div className="flex flex-1 flex-col">
               <ImageInputField
                  name="image"
                  text="프로필 이미지"
                  control={control}
                  error={errors.image}
               />

               <hr className="border-line-100 m-0 my-8 hidden border-t p-0 lg:block" />

               <div className="mt-8">
                  <GeneralInputField
                     name="nickName"
                     text="별명"
                     placeholder="사이트에 노출될 이름을 입력해주세요"
                     register={register}
                     error={errors.nickName}
                  />
               </div>

               <hr className="border-line-100 m-0 my-8 border-t p-0" />

               <GeneralInputField
                  name="career"
                  text="경력"
                  placeholder="기사님의 경력을 입력해주세요"
                  register={register}
                  error={errors.career}
               />

               <hr className="border-line-100 m-0 my-8 border-t p-0" />

               <GeneralInputField
                  name="introduction"
                  text="한 줄 소개"
                  placeholder="한 줄 소개를 입력해주세요"
                  register={register}
                  error={errors.introduction}
               />

               <hr className="border-line-100 m-0 my-8 border-t p-0 lg:hidden" />
            </div>

            <div className="flex-1">
               <TextAreaInputField
                  name="description"
                  text="상세 설명"
                  placeholder="상세 내용을 입력해주세요"
                  register={register}
                  error={errors.description}
               />

               <hr className="border-line-100 m-0 my-8 border-t p-0" />

               <ButtonInputField
                  name="serviceType"
                  text="제공 서비스"
                  isServiceType={true}
                  control={control}
                  error={
                     Array.isArray(errors.serviceType)
                        ? errors.serviceType[0]
                        : errors.serviceType
                  }
               />

               <hr className="border-line-100 m-0 my-8 border-t p-0" />

               <ButtonInputField
                  name="serviceArea"
                  text="서비스 가능 지역"
                  isArea={true}
                  control={control}
                  error={
                     Array.isArray(errors.serviceArea)
                        ? errors.serviceArea[0]
                        : errors.serviceArea
                  }
               />
            </div>
         </div>

         <div className="mt-17 lg:pl-185">
            <SolidButton disabled={!isValid || isLoading} type="submit">
               {isLoading ? "수정 중..." : "수정하기"}
            </SolidButton>
         </div>
      </form>
   );
}

export default MoverProfileUpdateForm;
