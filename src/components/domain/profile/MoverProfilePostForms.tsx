"use client";

import useMoverProfilePostForm from "@/lib/hooks/useMoverProfilePostForm";
import React from "react";
import ImageInputField from "./ImageInputField";
import GeneralInputField from "./GeneralInputField";
import TextAreaInputField from "./TextAreaInputField";
import ButtonInputField from "./ButtonInputField";
import SolidButton from "@/components/common/SolidButton";
import { MoverProfileInput } from "@/lib/schemas/profile.schema";

export default function MoverProfilePostForm() {
   const {
      register,
      control,
      errors,
      isValid,
      isLoading,
      handleSubmit,
      onSubmit,
   } = useMoverProfilePostForm();

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="mt-6 flex w-full flex-col lg:mt-12"
         aria-labelledby="profile-form-title"
      >
         <h2 id="profile-form-title" className="sr-only">
            기사 프로필 등록 폼
         </h2>

         <div className="flex flex-col lg:flex-row lg:gap-18">
            <div className="flex flex-1 flex-col">
               <GeneralInputField<MoverProfileInput>
                  labelId="nickname-label"
                  name="nickName"
                  text="별명"
                  placeholder="사이트에 노출될 이름을 입력해주세요"
                  register={register}
                  error={errors.nickName}
               />

               <hr className="border-line-100 m-0 border-t p-0" />

               <ImageInputField
                  labelId="image-label"
                  name="image"
                  text="프로필 이미지"
                  control={control}
                  error={errors.image}
               />

               <hr className="border-line-100 m-0 border-t p-0" />

               <GeneralInputField<MoverProfileInput>
                  labelId="career-label"
                  name="career"
                  text="경력"
                  placeholder="기사님의 경력을 입력해주세요"
                  register={register}
                  error={errors.career}
               />

               <hr className="border-line-100 m-0 border-t p-0" />

               <GeneralInputField<MoverProfileInput>
                  labelId="introduction-label"
                  name="introduction"
                  text="한 줄 소개"
                  placeholder="한 줄 소개를 입력해주세요"
                  register={register}
                  error={errors.introduction}
               />

               <hr className="border-line-100 m-0 border-t p-0 lg:hidden" />
            </div>

            <div className="flex-1">
               <TextAreaInputField
                  labelId="description-label"
                  name="description"
                  text="상세 설명"
                  placeholder="상세 내용을 입력해주세요"
                  register={register}
                  error={errors.description}
               />

               <hr className="border-line-100 m-0 border-t p-0" />

               <ButtonInputField
                  labelId="service-type-label"
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

               <hr className="border-line-100 m-0 border-t p-0" />

               <ButtonInputField
                  labelId="service-area-label"
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
            <SolidButton
               disabled={!isValid || isLoading}
               type="submit"
               aria-disabled={!isValid || isLoading}
            >
               {isLoading ? "등록 중..." : "시작하기"}
            </SolidButton>
         </div>
      </form>
   );
}
