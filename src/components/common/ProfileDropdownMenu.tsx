"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import WithdrawModal from "./WithdrawModal";
import ReactDOM from "react-dom";

export default function ProfileDropDownMenu() {
   const { user, logout } = useAuth();
   const router = useRouter();
   const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

   const handleLogout = () => {
      logout();
      router.replace("/mover-search");
   };

   const menuItems =
      user!.userType === "client"
         ? [
              { label: "프로필 수정", href: "/profile/edit" },
              { label: "찜한 기사님", href: "/favorite-movers" },
              { label: "이사 리뷰", href: "/reviews" },
           ]
         : [
              { label: "프로필 수정", href: "/profile/edit" },
              { label: "마이페이지", href: "/dashboard" },
           ];

   return (
      <div className="border-line-200 absolute top-10 left-1/2 z-10 h-auto min-w-38 -translate-x-1/2 rounded-2xl border-1 bg-white px-4 py-2.5 text-nowrap lg:top-12 lg:min-w-50">
         <h2 className="text-16-semibold lg:text-18-semibold py-2 lg:py-2.5">
            {user!.name +
               " " +
               (user!.userType === "client" ? "고객님" : "기사님")}
         </h2>
         <ul>
            {menuItems.map(({ label, href }) => (
               <li key={href}>
                  <Link
                     href={href}
                     className="text-14-medium lg:text-16-medium block py-2 lg:py-2.5"
                  >
                     {label}
                  </Link>
               </li>
            ))}
         </ul>
         <div className="bg-line-100 h-0.25 w-full"></div>
         <div className="text-14-regular lg:text-16-regular flex flex-col justify-center gap-1 pt-2 text-gray-500">
            <button onClick={handleLogout} className="block w-full">
               로그아웃
            </button>

            <button
               onClick={() => {
                  setIsWithdrawModalOpen(true);
               }}
               className="block w-full"
            >
               회원 탈퇴
            </button>
         </div>
         {isWithdrawModalOpen &&
            ReactDOM.createPortal(
               <WithdrawModal onClose={() => setIsWithdrawModalOpen(false)} />,
               document.body,
            )}
      </div>
   );
}
