"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import mobileLogo from "@/assets/images/logoMobile.svg";

export default function LandingHeader() {
   const [isScrolled, setIsScrolled] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 0);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <header
         className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-in-out ${isScrolled ? "bg-white" : "bg-none"} `}
      >
         <div className="mx-auto flex h-24 max-w-6xl items-center justify-between px-8 lg:px-0">
            <Link href={"/"}>
               <Image
                  src={mobileLogo}
                  alt="mobileLogo"
                  className="block h-8 w-7 md:!hidden"
               />
               <Image
                  src={logo}
                  alt="logo"
                  className="!hidden h-11 w-[116px] md:!block"
               />
            </Link>
            <nav
               className={`text-14-semibold md:text-18-bold flex items-center gap-3 md:gap-6 ${isScrolled ? "text-black-400" : "text-white"} `}
            >
               <Link
                  href={"/mover-search"}
                  className={` ${isScrolled ? "block" : "hidden"} bg-primary-blue-300 text-14-semibold md:text-16-bold rounded-full px-4 py-2.5 text-white md:px-6 md:py-2`}
               >
                  서비스 둘러보기
               </Link>
               <Link href={"/sign-in/client"}>로그인</Link>
               <Link href={"/sign-up/client"}>회원가입</Link>
            </nav>
         </div>
      </header>
   );
}
