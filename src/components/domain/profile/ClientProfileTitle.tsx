"use client";

import React from "react";
import ErrorText from "../auth/ErrorText";
import { useTranslations } from "next-intl";

interface Prop {
   type: "생성" | "서비스" | "지역" | "수정";
   error?: string;
}

export default function ClientProfileTitle({ type, error }: Prop) {
   const t = useTranslations("Profile");
   // ✅ 프로필 생성 제목
   if (type === "생성") {
      return (
         <section aria-labelledby="client-profile-create-title">
            <h2
               id="client-profile-create-title"
               className="text-black-400 text-18-bold lg:text-32-medium mb-4 lg:mb-7"
            >
               {t("createProfileTitle")}
            </h2>
            <p className="text-black-100 text-12-regular lg:text-20-regular mb-4 lg:mb-7">
               {t("createProfileDescription")}
            </p>
            <hr className="border-line-100 mb-5 lg:mb-16" />
         </section>
      );
   }

   // ✅ 이용 서비스
   if (type === "서비스") {
      return (
         <section
            aria-labelledby="client-service-type"
            className="mb-6 lg:mb-8"
         >
            <h3
               id="client-service-type"
               className="text-black-300 text-16-semibold lg:text-20-semibold mb-2 block"
            >
               {t("serviceTitle")}
            </h3>
            {!error && (
               <p className="text-12-regular lg:text-16-regular text-gray-400">
                  {t("serviceDescription")}
               </p>
            )}
            {error && <ErrorText error={error} position="left" />}
         </section>
      );
   }

   // ✅ 지역
   if (type === "지역") {
      return (
         <section aria-labelledby="living-area" className="mb-6 lg:mb-8">
            <h3
               id="living-area"
               className="text-black-300 text-16-semibold lg:text-20-semibold mb-2 block"
            >
               {t("regionTitle")}
            </h3>
            {!error && (
               <p className="text-12-regular lg:text-16-regular text-gray-400">
                  {t("regionDescription")}
               </p>
            )}
            {error && <ErrorText error={error} position="left" />}
         </section>
      );
   }

   // ✅ 프로필 수정 제목
   if (type === "수정") {
      return (
         <section aria-labelledby="client-profile-edit-title">
            <h2
               id="client-profile-edit-title"
               className="text-black-400 text-18-bold lg:text-32-medium mb-8 lg:mb-5"
            >
               {t("editProfileTitle")}
            </h2>
            <hr className="border-line-100 mb-5 lg:mb-10" />
         </section>
      );
   }
}
