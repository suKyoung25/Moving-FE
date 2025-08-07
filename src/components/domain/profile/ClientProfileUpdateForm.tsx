"use client";

import React from "react";
import ProfileFieldButton from "./ProfileFieldButton";
import ClientProfileTitle from "./ClientProfileTitle";
import ProfileInput from "./ProfileInput";
import SolidButton from "@/components/common/SolidButton";
import { MOVE_TYPES, moveType, regions } from "@/constants";
import useClientProfileUpdateForm from "@/lib/hooks/useClientProfileUpdateForm";
import ProfilePasswordInput from "./ProfilePasswordInput";
import OutlinedButton from "@/components/common/OutlinedButton";
import ImageInputField from "./ImageInputField";
import { useAuth } from "@/context/AuthContext";
import { ClientProfileUpdateValue } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const style1 = "lg:mb-14 lg:flex-row lg:justify-between lg:gap-14";
const borderStyle = "border-line-100 my-5 lg:my-8";

export default function ClientProfileUpdateForm() {
   const t = useTranslations("Profile");
   // ✅ 함수 등 모음
   const router = useRouter();
   const { user } = useAuth();
   const {
      register,
      errors,
      isValid,
      isLoading,
      handleServiceToggle,
      handleRegionToggle,
      onSubmit,
      handleSubmit,
      watch,
      control,
   } = useClientProfileUpdateForm();

   return (
      <>
         <form onSubmit={handleSubmit(onSubmit)}>
            <div
               className={
                  user?.provider === "LOCAL"
                     ? `flex flex-col ${style1}`
                     : "flex flex-col"
               }
            >
               {/* ✅ 입력창 모음 */}
               <div className={user?.provider === "LOCAL" ? "flex-1" : ""}>
                  <ProfileInput<ClientProfileUpdateValue>
                     type="text"
                     label={t("nameLabel")}
                     name="name"
                     placeholder={t("namePlaceholder")}
                     register={register}
                     error={errors.name?.message}
                  />
                  <hr
                     className={
                        user?.provider === "LOCAL"
                           ? `${borderStyle} lg:w-160`
                           : `${borderStyle} lg:w-full`
                     }
                  />
                  {/* 이메일은 변경할 수 있는 데이터가 아님 */}
                  <section className="flex w-full cursor-not-allowed flex-col gap-2 lg:gap-4">
                     <label className="text-black-300 text-16-semibold lg:text-20-semibold">
                        {t("emailLabel")}
                     </label>
                     <div className="text-black-400 bg-bg-200 flex h-14 items-center rounded-2xl p-3.5 lg:h-16">
                        {user?.email}
                     </div>
                  </section>
                  <hr
                     className={
                        user?.provider === "LOCAL"
                           ? `${borderStyle} lg:w-160`
                           : `${borderStyle} lg:w-full`
                     }
                  />
                  <ProfileInput<ClientProfileUpdateValue>
                     type="text"
                     label={t("phoneLabel")}
                     name="phone"
                     placeholder={t("phonePlaceholder")}
                     register={register}
                     error={errors.phone?.message}
                  />
                  <hr
                     className={
                        user?.provider === "LOCAL"
                           ? `${borderStyle} lg:w-160`
                           : `${borderStyle} lg:w-full`
                     }
                  />

                  {/* 비밀번호 관련 항목들 : 소셜 로그인 하면 화면에 안 나옴 */}
                  {user && user.provider !== "LOCAL" ? null : (
                     <>
                        <ProfilePasswordInput<ClientProfileUpdateValue>
                           label={t("currentPasswordLabel")}
                           name="password"
                           placeholder={t("currentPasswordPlaceholder")}
                           register={register}
                           error={errors.password?.message}
                        />
                        <hr className="border-line-100 my-5 lg:my-8 lg:w-160" />
                        <ProfilePasswordInput<ClientProfileUpdateValue>
                           label={t("newPasswordLabel")}
                           name="newPassword"
                           placeholder={t("newPasswordPlaceholder")}
                           register={register}
                           error={errors.newPassword?.message}
                        />
                        <hr className="border-line-100 my-5 lg:my-8 lg:w-160" />
                        <ProfilePasswordInput<ClientProfileUpdateValue>
                           label={t("newPasswordConfirmLabel")}
                           name="newPasswordConfirmation"
                           placeholder={t("newPasswordConfirmPlaceholder")}
                           register={register}
                           error={errors.newPasswordConfirmation?.message}
                        />
                        <hr className="border-line-100 my-5 lg:my-8 lg:hidden" />
                     </>
                  )}
               </div>

               <div className={user?.provider === "LOCAL" ? "flex-1" : ""}>
                  {/* ✅ 프로필 이미지 */}
                  <ImageInputField
                     name="profileImage"
                     text={t("profileImageLabel")}
                     control={control}
                  />

                  <hr
                     className={
                        user?.provider === "LOCAL"
                           ? `${borderStyle} lg:w-160`
                           : `${borderStyle} lg:w-full`
                     }
                  />

                  {/* ✅ 이용 서비스 */}
                  <section>
                     <ClientProfileTitle
                        type="서비스"
                        error={errors.serviceType?.message}
                     />

                     {moveType.map((service) => {
                        const value =
                           MOVE_TYPES[service as keyof typeof MOVE_TYPES]; // "소형이사" → "SMALL"

                        return (
                           <ProfileFieldButton
                              category="서비스"
                              name="serviceType"
                              key={service}
                              value={service}
                              isSelected={(watch("serviceType") || []).includes(
                                 value,
                              )}
                              onClick={() => handleServiceToggle(value)}
                           >
                              {t(`moveTypes.${value}`)}
                           </ProfileFieldButton>
                        );
                     })}
                  </section>

                  <hr
                     className={
                        user?.provider === "LOCAL"
                           ? `${borderStyle} lg:w-160`
                           : `${borderStyle} lg:w-full`
                     }
                  />

                  {/* ✅ 내가 사는 지역 */}
                  <section className="mb-8 lg:mb-14">
                     <ClientProfileTitle
                        type="지역"
                        error={errors.livingArea?.message}
                     />

                     <div className="grid w-70 grid-cols-5 gap-x-2 gap-y-3 lg:w-104 lg:gap-x-3.5 lg:gap-y-4.5">
                        {regions.map((region) => (
                           <ProfileFieldButton
                              category="지역"
                              name="livingArea"
                              key={region}
                              value={region}
                              isSelected={(watch("livingArea") || []).includes(
                                 region,
                              )}
                              onClick={() => handleRegionToggle(region)}
                           >
                              {t(`regions.${region}`)}
                           </ProfileFieldButton>
                        ))}
                     </div>
                  </section>
               </div>
            </div>

            {/* ✅ 제출 버튼 */}
            <section
               className={
                  user?.provider === "LOCAL"
                     ? "flex w-full flex-col gap-2 lg:flex-row lg:justify-between lg:gap-4"
                     : "flex w-full flex-col gap-2"
               }
            >
               <SolidButton
                  type="submit"
                  disabled={isLoading || !isValid}
                  className={
                     user?.provider === "LOCAL"
                        ? "max-w-165 lg:w-auto lg:flex-1"
                        : ""
                  }
               >
                  {isLoading ? t("loadingText") : t("updateButton")}
               </SolidButton>
               <OutlinedButton
                  onClick={() => router.push("/mover-search")}
                  className={
                     user?.provider === "LOCAL"
                        ? "max-w-165 !border-gray-200 !text-gray-200 lg:w-auto lg:flex-1"
                        : "!border-gray-200 !text-gray-200"
                  }
               >
                  {t("cancelButton")}
               </OutlinedButton>
            </section>
         </form>
      </>
   );
}
