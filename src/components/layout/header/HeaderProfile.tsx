"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import profileIcon from "@/assets/images/profileIcon.svg";
import Link from "next/link";
import ProfileDropdownMenu from "./ProfileDropdownMenu";

const iconStyle = "relative w-6 h-6 cursor-pointer";

export default function HeaderProfile() {
  const { user } = useAuth(); // 이용자 정보
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 영역 바깥을 클릭하면 메뉴 닫힘
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 프로필
  const profileDiv = (
    <div className="flex gap-4">
      {/* 프로필 아이콘 */}
      {user && (
        <figure className={`${iconStyle} rounded-full overflow-hidden`}>
          <Image
            src={user.profile || profileIcon}
            alt="프로필 아이콘"
            fill
            className="object-cover"
          />
        </figure>
      )}
      {/* 이용자 이름 */}
      {user?.nickname && (
        <span className="text-black-400 text-18-medium hidden lg:inline-block">
          {user.nickname}
        </span>
      )}
    </div>
  );

  // 반환: 기사면 링크 이동, 회원이면 dropdownMenu 열기
  return user?.userType === "mover" ? (
    <Link href="/profile">{profileDiv}</Link>
  ) : (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>{profileDiv}</button>
      {isOpen && <ProfileDropdownMenu onClose={() => setIsOpen(false)} />}
    </div>
  );
}
