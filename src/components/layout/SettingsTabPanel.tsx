"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { getNotificationEnabled, setNotificationEnabled } from "@/lib/utils";
import Image from "next/image";
import profileIcon from "@/assets/images/profileIcon.svg";
import { TbLogout } from "react-icons/tb";
import { FaCheck } from "react-icons/fa6";
import {
   IoVolumeMuteOutline,
   IoVolumeHighOutline,
   IoLanguage,
   IoChevronDown,
} from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { UserWithdrawal } from "../common/UserWithdrawal";

export default function SettingTabPanel() {
   const t = useTranslations("SupportHub");
   const { user } = useAuth();
   const router = useRouter();
   const pathname = usePathname();
   const [isEnabled, setIsEnabled] = useState(true);
   const [showWithdraw, setShowWithdraw] = useState(false);
   const [currentLang, setCurrentLang] = useState("ko");
   const [open, setOpen] = useState(false);
   const locale = useLocale();
   const wrapperRef = useRef(null);

   console.log(currentLang);

   const handleChangeLanguage = (newLocale: string) => {
      setCurrentLang(newLocale);

      if (newLocale === locale) return;
      const segments = pathname.split("/");
      segments[1] = newLocale;
      const newPath = segments.join("/");
      setTimeout(() => {
         router.replace(newPath);
      }, 400);
      setOpen(false);
   };

   const languages = [
      {
         label: t("settings.languages.korean"),
         code: "ko",
         subtitle: t("settings.languages.koreanSubtitle"),
      },
      {
         label: t("settings.languages.english"),
         code: "en",
         subtitle: t("settings.languages.englishSubtitle"),
      },
      {
         label: t("settings.languages.chinese"),
         code: "zh",
         subtitle: t("settings.languages.chineseSubtitle"),
      },
   ];

   const localeMap: Record<string, string> = {
      ko: t("settings.languages.koreanCode"),
      en: t("settings.languages.englishCode"),
      zh: t("settings.languages.chineseCode"),
   };

   useEffect(() => {
      if (user?.id) {
         setIsEnabled(getNotificationEnabled(user.id));
      }
   }, [user?.id]);

   const toggleNotification = () => {
      if (!user?.id) return;

      const newState = !isEnabled;
      setIsEnabled(newState);
      setNotificationEnabled(user.id, newState);
   };

   return (
      <div className="relative h-[60vh] max-h-150">
         {/* 메인 설정 화면 */}
         <motion.div
            animate={{ x: showWithdraw ? "-100%" : "0%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 bg-white"
         >
            <div className="scrollbar-hide h-full overflow-y-auto p-4">
               <h2 className="text-18-semibold lg:text-22-semibold">
                  {t("settings.title")}
               </h2>
               <div className="flex flex-col items-center gap-1 py-4">
                  <div className="relative mb-2 size-14 overflow-hidden rounded-full">
                     <Image
                        src={
                           user &&
                           typeof user.profileImage === "string" &&
                           user.profileImage.trim() !== ""
                              ? user.profileImage
                              : profileIcon
                        }
                        alt={t("settings.profileImage")}
                        fill
                        className="object-cover"
                     />
                  </div>
                  <h2 className="text-16-medium md:text-18-medium">
                     {user ? user.name : t("settings.name")}
                  </h2>
                  <span className="text-14-regular md:text-16-regular text-gray-900">
                     {user && typeof user.phone === "string"
                        ? user.phone
                        : t("settings.contactInfo")}
                  </span>
                  {user && (
                     <button
                        onClick={() => setShowWithdraw(true)}
                        className="bg-gray-1000 text-14-medium md:text-16-medium mt-2 flex items-center gap-1 rounded-md p-1 text-gray-900 lg:mt-3 lg:gap-1.5 lg:p-1.5"
                        aria-label={t("settings.withdrawAccount")}
                        title={t("settings.withdrawAccount")}
                     >
                        <span>{t("settings.withdrawAccount")}</span>
                        <TbLogout size={20} aria-hidden="true" />
                     </button>
                  )}
               </div>
               <div className="bg-line-100 my-2.5 h-[1px]"></div>
               <div className="px-2 py-4">
                  <div className="flex items-center justify-between py-3 text-gray-900">
                     <div className="flex items-center gap-2">
                        {isEnabled ? (
                           <IoVolumeHighOutline size={24} />
                        ) : (
                           <IoVolumeMuteOutline size={24} />
                        )}
                        <span className="text-16-regular">
                           {t("settings.chatNotification")}
                        </span>
                     </div>

                     <button
                        onClick={toggleNotification}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                           isEnabled ? "bg-primary-blue-300" : "bg-gray-300"
                        }`}
                        aria-label={
                           isEnabled
                              ? t("settings.disableNotification")
                              : t("settings.enableNotification")
                        }
                        title={
                           isEnabled
                              ? t("settings.disableNotification")
                              : t("settings.enableNotification")
                        }
                     >
                        <span
                           className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                              isEnabled ? "translate-x-6" : "translate-x-1"
                           }`}
                        />
                     </button>
                  </div>

                  {/* 언어 설정 - 메인 */}
                  <div ref={wrapperRef} className="py-3">
                     <div className="flex items-center justify-between text-gray-900">
                        <div className="flex items-center gap-2">
                           <IoLanguage size={24} />
                           <span className="">{t("settings.language")}</span>
                        </div>
                        <button
                           onClick={() => setOpen(!open)}
                           className="text-primary-blue-300 text-16-medium flex items-center gap-1.5"
                           aria-label={t("settings.selectLanguage")}
                           aria-expanded={open}
                        >
                           {localeMap[locale] || locale}
                           <IoChevronDown
                              size={18}
                              className={` ${open ? "rotate-180" : ""}`}
                              aria-hidden="true"
                           />
                        </button>
                     </div>
                  </div>

                  {/* 드롭다운 언어 선택 */}
                  <AnimatePresence>
                     {open && (
                        <motion.div
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: "auto" }}
                           exit={{ opacity: 0, height: 0 }}
                           transition={{ duration: 0.3, ease: "easeInOut" }}
                           className="mt-3 overflow-hidden"
                        >
                           <div className="space-y-1 rounded-lg p-2">
                              {languages.map(({ label, code, subtitle }) => (
                                 <button
                                    key={code}
                                    onClick={() => handleChangeLanguage(code)}
                                    className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors ${
                                       locale === code
                                          ? "text-primary-blue-300 border border-blue-200 bg-blue-100"
                                          : "border-line-100 hover:bg-hover-100 border bg-white text-gray-900"
                                    }`}
                                 >
                                    <div className="flex items-center gap-2">
                                       <span className="font-medium">
                                          {label}
                                       </span>
                                       <span>·</span>
                                       <span
                                          className={`text-12-regular text-gray-900`}
                                       >
                                          {subtitle}
                                       </span>
                                    </div>
                                    {locale === code && <FaCheck size={20} />}
                                 </button>
                              ))}
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
         </motion.div>

         {/* 계정 탈퇴 슬라이드 화면 */}
         <AnimatePresence>
            {showWithdraw && (
               <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0 z-10"
               >
                  <UserWithdrawal onClose={() => setShowWithdraw(false)} />
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}
