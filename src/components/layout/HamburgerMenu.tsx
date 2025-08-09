"use client";
import { motion } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import LanguageSwitcherMobile from "./LanguageSwitcherMobile";
import { useTranslations } from "next-intl";

const listVariants = {
   hidden: {},
   visible: {
      transition: {
         staggerChildren: 0.2,
      },
   },
};

const itemVariants = {
   hidden: { opacity: 0, y: 30 },
   visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
   },
};

export default function HamburgerMenu({
   user,
   isHamburgerOpen,
   setIsHamburgerOpen,
}: {
   user: User | null;
   isHamburgerOpen: boolean;
   setIsHamburgerOpen: Dispatch<SetStateAction<boolean>>;
}) {
   const t = useTranslations("Header");
   const router = useRouter();
   const [isMenuVisible, setIsMenuVisible] = useState(false);

   const menuItems = user
      ? user.userType === "client"
         ? [
              { label: t("nav.requestQuote"), href: "/request" },
              { label: t("nav.findMovers"), href: "/mover-search" },
              { label: t("nav.myQuotesClient"), href: "/my-quotes/client" },
              { label: "비용 계산기", href: "/cost-calculate" },
           ]
         : [
              { label: t("nav.receivedRequests"), href: "/received-requests" },
              { label: t("nav.myQuotesMover"), href: "/my-quotes/mover?tab=1" },
           ]
      : [
           { label: t("nav.login"), href: "/sign-in/client" },
           { label: t("nav.signUp"), href: "/sign-up/client" },
           { label: t("nav.findMovers"), href: "/mover-search" },
        ];

   useEffect(() => {
      const handleResizeOrOpen = () => {
         const isMobile = window.innerWidth < 1400;
         if (isHamburgerOpen && isMobile) {
            document.body.style.overflow = "hidden";
         } else {
            document.body.style.overflow = "";
         }
      };

      handleResizeOrOpen();
      window.addEventListener("resize", handleResizeOrOpen);

      return () => {
         document.body.style.overflow = "";
         window.removeEventListener("resize", handleResizeOrOpen);
      };
   }, [isHamburgerOpen]);

   return (
      <motion.div
         key="menu"
         initial={{ x: "100%", opacity: 0 }}
         animate={{ x: 0, opacity: 1 }}
         exit={{ x: "100%", opacity: 0 }}
         transition={{ type: "tween", duration: 0.6 }}
         onAnimationComplete={() => setIsMenuVisible(true)}
         className="fixed top-14 z-50 block h-[calc(100vh-56px)] w-full overflow-y-auto bg-white lg:hidden"
      >
         <div className="flex flex-col px-6 py-8 md:px-16 md:py-12">
            <motion.ul
               className="flex flex-col gap-11 md:gap-12"
               initial="hidden"
               animate={isMenuVisible ? "visible" : "hidden"}
               variants={listVariants}
            >
               {menuItems.map(({ label, href }, i) => (
                  <motion.li key={i} variants={itemVariants}>
                     <button
                        className="text-28-medium block w-full text-left"
                        onClick={() => {
                           setIsHamburgerOpen(false);
                           setTimeout(() => {
                              router.push(href);
                           }, 400);
                        }}
                     >
                        {label}
                     </button>
                  </motion.li>
               ))}
            </motion.ul>
         </div>
         <LanguageSwitcherMobile setIsHamburgerOpen={setIsHamburgerOpen} />
      </motion.div>
   );
}
