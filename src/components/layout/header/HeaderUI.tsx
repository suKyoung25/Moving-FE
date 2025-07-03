"use client";

import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import menuIcon from "@/assets/images/menuGrayIcon.svg";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Prop {
  onToggleMenu: () => void;
}

// Link 글자 스타일
const linkStyle = "text-black-400 text-18-bold flex gap-10";

export default function HeaderUI({ onToggleMenu }: Prop) {
  const { user, logout } = useAuth(); // 이용자 정보

  return (
    <header className="sticky top-0 left-0 z-20 bg-white border-b border-line-100">
      <div
        className="
            flex items-center justify-between mx-auto
            max-w-[1400px] h-14 lg:h-20 px-6 md:px-16 lg:px-0
            "
      >
        <div className="flex items-center gap-20">
          {/* 로고 */}
          <Link href="/mover-search">
            <figure
              className="
                relative cursor-pointer
                w-22 lg:w-29 h-[34px] lg:h-11
              "
            >
              <Image src={logo} alt="무빙 로고" fill />
            </figure>
          </Link>

          {/* lg Menu */}
          <nav className="hidden lg:block">
            {!user && (
              <>
                <Link href="/mover-search" className={linkStyle}>
                  기사님 찾기
                </Link>
              </>
            )}
            {user?.userType === "client" && (
              <>
                <Link href="" className={linkStyle}>
                  견적 요청
                </Link>
                <Link href="/mover-search" className={linkStyle}>
                  기사님 찾기
                </Link>
                <Link href="" className={linkStyle}>
                  내 견적 찾기
                </Link>
              </>
            )}
            {user?.userType === "mover" && (
              <>
                <Link href="" className={linkStyle}>
                  받은 요청
                </Link>
                <Link href="" className={linkStyle}>
                  내 견적 관리
                </Link>
              </>
            )}
          </nav>
        </div>

        <div>
          {/* sm, md Menu 버튼 */}
          <figure
            onClick={onToggleMenu}
            className="relative w-6 h-6 lg:hidden cursor-pointer"
          >
            <Image src={menuIcon} alt="메뉴 아이콘" fill />
          </figure>

          {/* 로그인 버튼 */}
          {!user && (
            <Link href="/sign-in/client">
              <button
                className="
                  hidden lg:flex w-[116px] h-11
                  justify-center items-center
                  bg-primary-blue-300 hover:bg-primary-blue-200 rounded-2xl
                  text-white text-18-semibold
              "
              >
                로그인
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
