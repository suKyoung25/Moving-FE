"use client";

import HeaderUI from "@/components/layout/HeaderUI";
import HeaderSideBarMenu from "@/components/layout/HeaderSideBarMenu";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header({ children }: { children?: React.ReactNode }) {
   const [isMenuOpen, setIsMenuOpen] = useState(false); // 헤더 모바일 메뉴

   const pathname = usePathname();
   const isRequestPage =
      pathname.startsWith("/request") ||
      pathname.startsWith("/reviews") ||
      pathname.startsWith("/favorite-movers") ||
      pathname === "/my-quotes/client" ||
      pathname === "/my-quotes/mover";

   return (
      <>
         {!isRequestPage ? (
            <HeaderUI onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
         ) : (
            <div>
               <HeaderUI onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
               <div className="w-full bg-white">
                  <div className="mx-auto w-full max-w-350 items-center px-6 md:px-16 lg:min-h-22 lg:px-0">
                     {children}
                  </div>
               </div>
            </div>
         )}
         {isMenuOpen && (
            <HeaderSideBarMenu onClick={() => setIsMenuOpen(false)} />
         )}
      </>
   );
}
