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
         <div className="sticky top-0 left-0 z-20 w-full bg-white">
            {!isRequestPage ? (
               <HeaderUI onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
            ) : (
               <>
                  <HeaderUI onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
                  <div className="w-full">
                     <div className="mx-auto max-w-350 px-6 md:px-16 lg:px-0">
                        {children}
                     </div>
                  </div>
               </>
            )}
         </div>
         {isMenuOpen && (
            <HeaderSideBarMenu onClick={() => setIsMenuOpen(false)} />
         )}
      </>
   );
}
