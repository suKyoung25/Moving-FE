"use client";
import Image from "next/image";
import admin from "@/assets/images/admin.png";
import { IoIosSend } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function HomeTabPanel() {
   const t = useTranslations("SupportHub");
   const router = useRouter();

   return (
      <div>
         <div className="flex gap-2">
            <Image
               src={admin}
               alt={t("adminAlt")}
               width={36}
               height={36}
               priority
               className="h-9 w-9 rounded-lg"
            />
            <div>
               <h3 className="text-16-medium lg:text-18-medium">
                  {t("adminTitle")}
               </h3>
               <p className="text-14-regular lg:text-16-regular">
                  {t("adminMessage")}
               </p>
            </div>
         </div>
         <div className="mt-6 flex flex-col">
            <button
               onClick={() => router.push("/support")}
               className="bg-black-400 text-16-semibold hover:bg-black-500 flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-white transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
               aria-label={t("contactUsButton")}
               title={t("contactUsButton")}
            >
               {t("contactUs")}
               <IoIosSend className="size-5" aria-hidden="true" />
            </button>
            <span
               className="text-12-regular mt-2 text-center text-gray-900 lg:mt-2.5"
               aria-label={t("responseTimeInfo")}
            >
               {t("responseTime")}
            </span>
         </div>
      </div>
   );
}
