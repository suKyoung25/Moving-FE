"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// prop
interface Prop {
   onClose: () => void;
}

// 스타일
const commonTextStyle =
   "flex w-full pl-3 py-2 items-center gap-0.5 text-black-400 lg:py-3.5";

export default function ProfileDropdownMenu({ onClose }: Prop) {
   const { user, logout } = useAuth();
   const router = useRouter();

   // 메뉴 닫는 함수
   const handleLogout = () => {
      logout();
      onClose();
      router.replace("/mover-search");
   };

   const handleCloseMenu = () => onClose();

   return (
      <section className="border-line-200 absolute top-9 left-1/2 z-40 inline-flex w-38 -translate-x-1/2 flex-col items-start rounded-2xl border bg-white px-1.5 pt-2.5 pb-1.5 shadow-[2px_2px_8px_rgba(224,224,224,0.2)] lg:left-[-2rem] lg:w-62 lg:px-1 lg:pt-4 lg:pb-1.5">
         <div className="w-full">
            {/* 이용자 이름 */}
            {user?.userType === "client" && (
               <p className={`${commonTextStyle} text-16-bold lg:text-18-bold`}>
                  {user?.name} 고객님
               </p>
            )}
            {user?.userType === "mover" && (
               <p className={`${commonTextStyle} text-16-bold lg:text-18-bold`}>
                  {user?.name} 기사님
               </p>
            )}

            {/* 메뉴 */}
            {user?.userType === "client" && (
               <>
                  <Link
                     href="/profile/edit"
                     onClick={handleCloseMenu}
                     className={`${commonTextStyle} text-14-medium lg:text-16-medium cursor-pointer`}
                  >
                     프로필 수정
                  </Link>
                  <Link
                     href="/favorite-movers"
                     onClick={handleCloseMenu}
                     className={`${commonTextStyle} text-14-medium lg:text-16-medium cursor-pointer`}
                  >
                     찜한 기사님
                  </Link>
                  <Link
                     href="/reviews"
                     onClick={handleCloseMenu}
                     className={`${commonTextStyle} text-14-medium lg:text-16-medium cursor-pointer`}
                  >
                     이사 리뷰
                  </Link>
                  <p
                     onClick={handleLogout}
                     className="text-12-regular lg:text-16-regular border-line-100 mt-3 flex h-10 cursor-pointer items-center justify-center border-t text-gray-500 lg:pt-2"
                  >
                     로그아웃
                  </p>
               </>
            )}
            {user?.userType === "mover" && (
               <>
                  <Link
                     href="/dashboard"
                     onClick={handleCloseMenu}
                     className={`${commonTextStyle} text-14-medium lg:text-16-medium cursor-pointer`}
                  >
                     마이페이지
                  </Link>
                  <p
                     onClick={handleLogout}
                     className="text-12-regular lg:text-16-regular border-line-100 mt-3 flex h-10 cursor-pointer items-center justify-center border-t text-gray-500 lg:pt-2"
                  >
                     로그아웃
                  </p>
               </>
            )}
         </div>
      </section>
   );
}
