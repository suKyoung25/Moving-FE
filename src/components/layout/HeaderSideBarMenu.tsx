"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import xIcon from "@/assets/images/xIcon.svg";
import Image from "next/image";

interface Prop {
   onClick: () => void;
}

// Link 글자 스타일
const linkStyle = "text-black-400 text-18-medium flex gap-10 px-5 py-6";

export default function HeaderSideBarMenu({ onClick }: Prop) {
   const { user } = useAuth(); // 이용자 정보

   return (
      // 배경
      <section onClick={onClick} className="bg-bg-black/50 fixed inset-0 z-30">
         {/* SideBar 영역 */}
         <aside
            onClick={(e) => e.stopPropagation()} // 내부 클릭 시 창이 안 닫히게
            className="fixed top-0 right-0 z-50 min-h-screen w-55 bg-white"
         >
            {/* X 버튼 */}
            <div className="border-line-100 h-14 border-b">
               <button onClick={onClick} className="absolute top-4 right-4">
                  <Image src={xIcon} alt="x 아이콘" width={24} height={24} />
               </button>
            </div>

            <nav>
               {!user && (
                  <>
                     <Link href="/mover-search" className={linkStyle}>
                        기사님 찾기
                     </Link>
                     <Link href="/sign-in/client" className={linkStyle}>
                        로그인
                     </Link>
                  </>
               )}
               {user?.userType === "client" && (
                  <>
                     <Link href="/request" className={linkStyle}>
                        견적 요청
                     </Link>
                     <Link href="/mover-search" className={linkStyle}>
                        기사님 찾기
                     </Link>
                     <Link href="/my-quotes" className={linkStyle}>
                        내 견적 관리
                     </Link>
                  </>
               )}
               {user?.userType === "mover" && (
                  <>
                     <Link href="/received-requests" className={linkStyle}>
                        받은 요청
                     </Link>
                     <Link href="/my-quotes" className={linkStyle}>
                        내 견적 관리
                     </Link>
                  </>
               )}
            </nav>
         </aside>
      </section>
   );
}
