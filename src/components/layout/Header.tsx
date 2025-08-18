"use client";

import Image from "next/image";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { Link } from "@/i18n/navigation";
import logo from "@/assets/images/logo.svg";
import logoMobile from "@/assets/images/logoMobile.svg";
import hamburgerMenu from "@/assets/images/menuGrayIcon.svg";
import close from "@/assets/images/xIcon.svg";
import HamburgerMenu from "./HamburgerMenu";
import alarmIcon from "@/assets/images/alarmIcon.svg";
import profileIcon from "@/assets/images/profileIcon.svg";
import ProfileDropDownMenu from "@/components/common/ProfileDropdownMenu";
import { useAuth } from "@/context/AuthContext";
import NotificationModal from "../common/NotificationModal";
import { routing } from "@/i18n/routing"; // locales 배열 접근용
import { useLocale, useTranslations } from "next-intl";
import { useNotification } from "@/context/NotificationContext";
import { useNotificationsQuery } from "@/lib/api/notification/query";

function getPathnameWithoutLocale(
   pathname: string,
   locales: readonly string[],
) {
   for (const locale of locales) {
      if (pathname.startsWith(`/${locale}`)) {
         return pathname.slice(locale.length + 1) || "/";
      }
   }
   return pathname;
}

export default function Header({ children }: { children?: React.ReactNode }) {
   const t = useTranslations("Header");
   const { user } = useAuth();
   const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
   const [isProfileDropDownOpen, setIsProfileDropDownOpen] = useState(false);
   const [isNotiModalOpen, setIsNotiModalOpen] = useState(false);
   const pathname = usePathname();
   const profileRef = useRef<HTMLDivElement>(null);
   const notificationRef = useRef<HTMLDivElement>(null);
   const locale = useLocale();
   const { unreadCount } = useNotification();
   const { isLoading } = useNotificationsQuery(locale);

   const isActive = (path: string) => pathnameWithoutLocale.startsWith(path);
   const linkClass = (path: string) =>
      clsx(isActive(path) && "!text-black-400");

   const pathnameWithoutLocale = getPathnameWithoutLocale(
      pathname,
      routing.locales,
   );

   const isSubHeader =
      pathnameWithoutLocale.startsWith("/request") ||
      pathnameWithoutLocale.startsWith("/reviews") ||
      pathnameWithoutLocale.startsWith("/favorite-movers") ||
      pathnameWithoutLocale === "/my-quotes/client" ||
      pathnameWithoutLocale === "/my-quotes/mover";

   useOutsideClick(profileRef, () => setIsProfileDropDownOpen(false));

   useOutsideClick(notificationRef, () => setIsNotiModalOpen(false));

   return (
      <header className="border-line-100 sticky top-0 left-0 z-20 w-full border-b bg-white">
         <div className="mx-auto flex h-14 max-w-350 items-center px-6 md:px-16 lg:h-22 lg:px-0">
            <h1>
               <Link href={"/mover-search"}>
                  <Image
                     src={logo}
                     alt={t("logoAlt")}
                     width={88}
                     height={34}
                     className="!hidden md:!block lg:h-11 lg:w-29"
                  />
                  <Image
                     src={logoMobile}
                     alt={t("logoMobileAlt")}
                     className="block md:!hidden"
                  />
               </Link>
            </h1>

            <nav className="[&_a:hover]:text-black-400 [&_a]:text-18-bold [&_a::after]:bg-black-400 hidden pl-15 lg:flex lg:gap-6 [&_a]:relative [&_a]:text-gray-400 [&_a]:transition-all [&_a]:duration-300 [&_a::after]:absolute [&_a::after]:bottom-0 [&_a::after]:left-0 [&_a::after]:h-0.5 [&_a::after]:w-0 [&_a::after]:transition-all [&_a::after]:duration-300 [&_a::after]:content-[''] [&_a:hover::after]:w-full">
               {!user && (
                  <>
                     <Link
                        href="/mover-search"
                        className={linkClass("/mover-search")}
                     >
                        {t("nav.findMovers")}
                     </Link>
                     <Link
                        href="/estimate-calculator"
                        className={linkClass("/estimate-calculator")}
                     >
                        {t("nav.estimateCalculator")}
                     </Link>
                     <Link
                        href="/community"
                        className={linkClass("/community")}
                     >
                        {t("nav.community")}
                     </Link>
                  </>
               )}

               {user?.userType === "client" && (
                  <>
                     <Link href="/request" className={linkClass("/request")}>
                        {t("nav.requestQuote")}
                     </Link>
                     <Link
                        href="/mover-search"
                        className={linkClass("/mover-search")}
                     >
                        {t("nav.findMovers")}
                     </Link>
                     <Link
                        href="/my-quotes/client"
                        className={linkClass("/my-quotes/client")}
                     >
                        {t("nav.myQuotes")}
                     </Link>
                     <Link
                        href="/estimate-calculator"
                        className={linkClass("/estimate-calculator")}
                     >
                        {t("nav.estimateCalculator")}
                     </Link>
                     <Link
                        href="/community"
                        className={linkClass("/community")}
                     >
                        {t("nav.community")}
                     </Link>
                  </>
               )}

               {user?.userType === "mover" && (
                  <>
                     <Link
                        href="/received-requests"
                        className={linkClass("/received-requests")}
                     >
                        {t("nav.receivedRequests")}
                     </Link>
                     <Link
                        href="/my-quotes/mover?tab=1"
                        className={linkClass("/my-quotes/mover")}
                     >
                        {t("nav.myQuotes")}
                     </Link>
                     <Link
                        href="/estimate-calculator"
                        className={linkClass("/estimate-calculator")}
                     >
                        {t("nav.estimateCalculator")}
                     </Link>
                     <Link
                        href="/community"
                        className={linkClass("/community")}
                     >
                        {t("nav.community")}
                     </Link>
                  </>
               )}
            </nav>
            <div className="flex flex-1 flex-row-reverse items-center gap-6">
               <button
                  onClick={() => setIsHamburgerOpen((prev) => !prev)}
                  className="relative after:absolute after:top-1/2 after:left-1/2 after:block after:-translate-x-1/2 after:-translate-y-1/2 after:p-4 after:content-[''] lg:hidden"
               >
                  <Image
                     src={isHamburgerOpen ? close : hamburgerMenu}
                     alt={
                        isHamburgerOpen ? t("closeAlt") : t("hamburgerMenuAlt")
                     }
                     width={28}
                     height={28}
                  />
               </button>
               {!user && (
                  <div className="flex items-center gap-6">
                     <div className="bg-primary-blue-300 [&_*]:text-18-medium relative hidden min-h-11 min-w-32 rounded-2xl p-4 lg:block [&_*]:text-nowrap [&_*]:text-white [&_*]:transition-all [&_*]:duration-500 hover:[&>div]:opacity-100 hover:[&>span]:opacity-0">
                        <span className="absolute top-1/2 left-1/2 -translate-1/2 opacity-100">
                           {t("login")}
                        </span>
                        <div className="absolute top-1/2 left-1/2 flex -translate-1/2 items-center gap-2 opacity-0">
                           <Link
                              href={"/sign-in/client"}
                              className="hidden will-change-transform hover:scale-[1.05] lg:block"
                           >
                              {t("loginClient")}
                           </Link>
                           <span>/</span>
                           <Link
                              href={"/sign-in/mover"}
                              className="hidden will-change-transform hover:scale-[1.05] lg:block"
                           >
                              {t("loginMover")}
                           </Link>
                        </div>
                     </div>
                  </div>
               )}
               {user?.userType && (
                  <div className="flex items-center gap-6 lg:gap-8">
                     <div
                        ref={notificationRef}
                        className="relative h-6 w-6 lg:h-8 lg:w-8"
                     >
                        <button
                           onClick={() => setIsNotiModalOpen((prev) => !prev)}
                        >
                           <Image
                              src={alarmIcon}
                              alt={t("alarmAlt")}
                              className="lg:w-full"
                           />
                           {unreadCount && (
                              <span className="absolute top-0 right-0 flex size-3.5 -translate-y-1 lg:size-5 lg:translate-x-0.5 lg:-translate-y-1">
                                 <span className="text-10-bold lg:text-12-bold absolute inline-flex h-full w-full items-center justify-center rounded-full bg-blue-300 p-2 text-white">
                                    {unreadCount >= 99 ? "99+" : unreadCount}
                                 </span>
                              </span>
                           )}
                        </button>
                        {!isLoading && isNotiModalOpen && (
                           <NotificationModal
                              setIsNotiModalOpen={setIsNotiModalOpen}
                           />
                        )}
                     </div>
                     <div
                        ref={profileRef}
                        className="relative flex size-6 justify-center lg:size-8"
                     >
                        <button
                           onClick={() =>
                              setIsProfileDropDownOpen((prev) => !prev)
                           }
                           className="size-6 lg:size-8"
                        >
                           {user?.profileImage ? (
                              <Image
                                 src={user.profileImage}
                                 alt={t("profileAlt")}
                                 width={32}
                                 height={32}
                                 className="size-6 rounded-full object-cover lg:size-8"
                              />
                           ) : (
                              <Image
                                 src={profileIcon}
                                 width={32}
                                 height={32}
                                 alt={t("profileDefaultAlt")}
                                 className="size-6 rounded-full object-cover lg:size-8"
                              />
                           )}
                        </button>
                        {isProfileDropDownOpen && <ProfileDropDownMenu />}
                     </div>
                     <span className="text-18-medium hidden lg:block">
                        {user.name}
                        {t("honorific")}
                     </span>
                  </div>
               )}
            </div>
         </div>

         <AnimatePresence mode="wait">
            {isSubHeader && (
               <motion.div
                  key={pathname} // 경로 바뀔 때마다 트리거
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                     duration: 0.6,
                     ease: "easeInOut",
                  }}
                  className="w-full overflow-hidden"
               >
                  <div className="mx-auto max-w-350 px-6 md:px-16 lg:px-0">
                     {children}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         <AnimatePresence>
            {isHamburgerOpen && (
               <HamburgerMenu
                  user={user}
                  isHamburgerOpen={isHamburgerOpen}
                  setIsHamburgerOpen={setIsHamburgerOpen}
               />
            )}
         </AnimatePresence>
      </header>
   );
}
