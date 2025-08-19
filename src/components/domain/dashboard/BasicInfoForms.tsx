"use client";

import React, { useEffect, useState } from "react";
import BasicInputField from "./BasicInputField";
import SecretInputField from "./SecretInputField";
import { useRouter } from "next/navigation";
import useMoverBasicInfo from "@/lib/hooks/useMoverBasicInfo";
import { MoverBasicInfoInput } from "@/lib/schemas/dashboard.schema";
import SolidButton from "@/components/common/SolidButton";
import OutlinedButton from "@/components/common/OutlinedButton";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

export default function BasicInfoForms() {
   const t = useTranslations("Dashboard");
   const router = useRouter();
   const { user } = useAuth();
   const [isSocialUser, setIsSocialUser] = useState(false); // 소셜 인증자의 경우

   useEffect(() => {
      if (user?.provider !== "LOCAL") {
         setIsSocialUser(true);
      } else {
         setIsSocialUser(false);
      }
   }, [user]);

   const { register, errors, isValid, isLoading, handleSubmit, onSubmit } =
      useMoverBasicInfo();

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         aria-labelledby="basic-info-form-title"
      >
         <h2 id="basic-info-form-title" className="sr-only">
            {t("basicInfoEditTitle")}
         </h2>

         <div className="flex flex-col lg:flex-row lg:gap-18">
            <div className="flex-1">
               <BasicInputField<MoverBasicInfoInput>
                  labelId="name-label"
                  name="name"
                  text={t("name")}
                  placeholder={t("namePlaceholder")}
                  register={register}
                  error={errors.name?.message}
               />

               <hr className="p-o border-line-100 my-8 border-t" />

               <BasicInputField<MoverBasicInfoInput>
                  labelId="email-label"
                  name="email"
                  text={t("email")}
                  register={register}
                  readOnly
               />

               <hr className="p-o border-line-100 my-8 border-t" />

               <BasicInputField<MoverBasicInfoInput>
                  labelId="phone-label"
                  name="phone"
                  text={t("phone")}
                  placeholder={t("phonePlaceholder")}
                  register={register}
                  error={errors.phone?.message}
               />
            </div>

            <hr className="p-o border-line-100 my-8 border-t lg:hidden" />

            {isSocialUser ? null : (
               <>
                  <div className="flex-1">
                     <SecretInputField<MoverBasicInfoInput>
                        name="existedPassword"
                        text={t("currentPassword")}
                        placeholder={t("currentPasswordPlaceholder")}
                        register={register}
                        error={errors.existedPassword?.message}
                     />

                     <hr className="p-o border-line-100 my-8 border-t" />
                     <SecretInputField<MoverBasicInfoInput>
                        name="newPassword"
                        text={t("newPassword")}
                        placeholder={t("newPasswordPlaceholder")}
                        register={register}
                        error={errors.newPassword?.message}
                     />
                     <hr className="p-o border-line-100 my-8 border-t" />
                     <SecretInputField<MoverBasicInfoInput>
                        name="newPasswordConfirmation"
                        text={t("newPasswordConfirmation")}
                        placeholder={t("newPasswordConfirmationPlaceholder")}
                        register={register}
                        error={errors.newPasswordConfirmation?.message}
                     />

                     <hr className="my-4 border-t opacity-0 lg:hidden" />
                  </div>
               </>
            )}
         </div>

         <div className="flex flex-col gap-2 lg:mt-16 lg:flex-row-reverse lg:gap-18">
            <SolidButton disabled={!isValid || isLoading} type="submit">
               {isLoading ? t("updating") : t("update")}
            </SolidButton>
            <OutlinedButton onClick={() => router.push("/dashboard")}>
               {t("cancel")}
            </OutlinedButton>
         </div>
      </form>
   );
}
