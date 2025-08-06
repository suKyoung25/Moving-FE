import React from "react";
import Link from "next/link";
import Image from "next/image";
import SolidButton from "@/components/common/SolidButton";
import OutlinedButton from "@/components/common/OutlinedButton";
import writingIcon from "@/assets/images/writingIcon.svg";
import writingIconGray from "@/assets/images/writingIconGray.svg";
import { useTranslations } from "next-intl";

const btnClass = "flex w-full items-center justify-center gap-2";

export default function EditButtons() {
   const t = useTranslations("Dashboard");

   return (
      <>
         <Link href="/profile/edit" className="w-full">
            <SolidButton className={btnClass}>
               {t("editProfileBtn")}
               <Image
                  src={writingIcon}
                  alt={t("editProfileAlt")}
                  className="h-6 w-6"
               />
            </SolidButton>
         </Link>
         <Link href="/dashboard/edit-account" className="w-full">
            <OutlinedButton
               className={`${btnClass} hover:!bg-bg-200 !border-gray-200 !text-gray-300`}
            >
               {t("editBasicInfoBtn")}
               <Image
                  src={writingIconGray}
                  alt={t("editBasicInfoAlt")}
                  className="h-6 w-6"
               />
            </OutlinedButton>
         </Link>
      </>
   );
}
