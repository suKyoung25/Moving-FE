"use client";

import React from "react";
import Image from "next/image";
import carImage from "@/assets/images/emptyCarIcon.svg";
import Link from "next/link";
import SolidButton from "@/components/common/SolidButton";
import { useTranslations } from "next-intl";

export default function Step4() {
   const t = useTranslations("Request");

   return (
      <div className="mt-30 flex flex-col items-center gap-8">
         <Image
            src={carImage}
            alt={t("inProgressAlt")}
            className="w-61 lg:mb-8 lg:w-[402px]"
         />
         <p className="text-14-regular lg:text-20-regular flex justify-center text-center text-gray-400">
            {t("inProgressMessageLine1")}
            <br />
            {t("inProgressMessageLine2")}
         </p>
         <Link href="/my-quotes/client">
            <SolidButton className="max-w-49 px-6">
               {t("goToReceivedQuotesButton")}
            </SolidButton>
         </Link>
      </div>
   );
}
