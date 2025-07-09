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
    <section
      className="absolute z-40 left-1/2 -translate-x-1/2 top-9 lg:left-[-2rem]
        inline-flex flex-col items-start w-38 h-56 lg:w-62 lg:h-74
        bg-white border border-line-200 rounded-2xl shadow-[2px_2px_8px_rgba(224,224,224,0.2)]
        p-[10px_6px_6px_6px] lg:p-[16px_4px_6px_4px]
      "
    >
      <div className="w-full">
        <p className={`${commonTextStyle} text-16-bold lg:text-18-bold`}>
          {user?.nickname} 고객님
        </p>
        <Link
          href="/profile"
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
          className="text-gray-500 text-12-regular lg:text-16-regular
            border-t border-line-100 cursor-pointer
            mt-3 lg:pt-2 flex justify-center items-center h-10"
        >
          로그아웃
        </p>
      </div>
    </section>
  );
}
