"use client";
import { motion } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import LanguageSwitcher from "./LanguageSwitcher";

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
   const router = useRouter();
   const [isMenuVisible, setIsMenuVisible] = useState(false);

   const menuItems = user
      ? user.userType === "client"
         ? [
              { label: "견적 요청", href: "/request" },
              { label: "기사님 찾기", href: "/mover-search" },
              { label: "내 견적 관리", href: "/my-quotes/client" },
           ]
         : [
              { label: "받은 요청", href: "/received-requests" },
              { label: "내 견적 관리", href: "/my-quotes/mover" },
           ]
      : [
           { label: "로그인", href: "/sign-in/client" },
           { label: "회원가입", href: "/sign-up/client" },
           { label: "기사님 찾기", href: "/mover-search" },
           { label: "문의하기", href: "/support" },
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
         <LanguageSwitcher />
      </motion.div>
   );
}
