"use client";

import React from "react";
import ImageInputField from "./ImageInputField";
import GeneralInputField from "./GeneralInputField";
import TextAreaInputField from "./TextAreaInputField";
import ButtonInputField from "./ButtonInputField";
import SolidButton from "@/components/common/SolidButton";
import useMoverProfileUpdateForm from "@/lib/hooks/useMoverProfileUpdateForm";
import OutlinedButton from "@/components/common/OutlinedButton";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function MoverProfileUpdateForm() {
   const t = useTranslations("Profile");
   const router = useRouter();

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
                  text={t("profileImageLabel")}
                  control={control}
                  error={errors.image}
               />

               {/* 통일된 hr: lg에서만 보이도록 */}
               <hr className="border-line-100 my-6 hidden w-full shrink-0 border-0 border-t lg:block" />

               <GeneralInputField
                  name="nickName"
                  text={t("nickNameLabel")}
                  placeholder={t("nickNamePlaceholder")}
                  register={register}
                  error={errors.nickName}
               />

               <hr className="border-line-100 my-6 w-full shrink-0 border-0 border-t" />

               <GeneralInputField
                  name="career"
                  text={t("careerLabel")}
                  placeholder={t("careerPlaceholder")}
                  register={register}
                  error={errors.career}
               />

               <hr className="border-line-100 my-6 w-full shrink-0 border-0 border-t" />

               <GeneralInputField
                  name="introduction"
                  text={t("introductionLabel")}
                  placeholder={t("introductionPlaceholder")}
                  register={register}
                  error={errors.introduction}
               />

               {/* 통일된 hr: lg에서 숨김 */}
               <hr className="border-line-100 my-6 w-full shrink-0 border-0 border-t lg:hidden" />
            </div>

            <div className="flex-1">
               <TextAreaInputField
                  name="description"
                  text={t("descriptionLabel")}
                  placeholder={t("descriptionPlaceholder")}
                  register={register}
                  error={errors.description}
               />

               <hr className="border-line-100 my-6 w-full shrink-0 border-0 border-t" />

               <ButtonInputField
                  name="serviceType"
                  text={t("providedServicesLabel")}
                  isServiceType={true}
                  control={control}
                  error={
                     Array.isArray(errors.serviceType)
                        ? errors.serviceType[0]
                        : errors.serviceType
                  }
               />

               {/* 기존 mt-8 대신 간격 통일 */}
               <hr className="border-line-100 my-6 w-full shrink-0 border-0 border-t" />

               <ButtonInputField
                  name="serviceArea"
                  text={t("serviceAreasLabel")}
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

         <div className="mt-17 flex flex-col gap-2 lg:mt-16 lg:flex-row-reverse lg:gap-18">
            <SolidButton disabled={!isValid || isLoading} type="submit">
               {isLoading ? t("updatingText") : t("updateButton")}
            </SolidButton>
            <OutlinedButton onClick={() => router.push("/dashboard")}>
               {t("cancelButton")}
            </OutlinedButton>
         </div>
      </form>
   );
}
