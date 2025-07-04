"use client";

import Image from "next/image";
import logo from "@/assets/images/logoMobile.svg";
import logoText from "@/assets/images/logoText.svg";
import menuIcon from "@/assets/images/menuGrayIcon.svg";
import alarmIcon from "@/assets/images/alarmIcon.svg";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import HeaderProfile from "./HeaderProfile";

// prop
interface Prop {
  onToggleMenu: () => void;
}

// 링크 스타일
const defaultLinkStyle =
  "text-18-bold flex gap-10 hover:text-black-400 active:text-black-400";
const iconStyle = "relative w-6 h-6 cursor-pointer";

// ★ 본문
export default function HeaderUI({ onToggleMenu }: Prop) {
  const { user } = useAuth(); // 이용자 정보
  const pathname = usePathname(); // 현재 경로 받기 (링크 색상)

  // ✅ 로고, 밑줄 스타일 바꿀 페이지 정리
  const isDefaultLogoPage = ["/sign-up", "/sign-in", "/profile"].some((path) =>
    pathname.startsWith(path)
  );

  // 링크 스타일22
  const linkStyle = (href: string) => {
    const cleanPathname = pathname.replace(/\/$/, "");
    const cleanHref = href.replace(/\/$/, "");

    return cleanPathname.startsWith(cleanHref)
      ? `${defaultLinkStyle} text-black-400`
      : `${defaultLinkStyle} text-gray-400`;
  };

  return (
    <header
      className={`
        sticky top-0 left-0 z-25 bg-white
        ${
          isDefaultLogoPage
            ? "border-b border-line-100"
            : "lg:border-b lg:border-line-100"
        }`}
    >
      <div
        className="
            flex items-center justify-between mx-auto
            max-w-[1400px] h-14 lg:h-22 px-6 md:px-16 lg:px-0
            "
      >
        <div className="flex items-center gap-20">
          {/* ✅ 로고 */}
          <Link href="/mover-search">
            <figure className="relative flex gap-0 cursor-pointer h-8 lg:h-11 lg:gap-2.5">
              <Image src={logo} alt="무빙 로고(icon)" />
              <Image
                src={logoText}
                alt="무빙 로고(text)"
                className={isDefaultLogoPage ? "block" : "!hidden md:!block"}
              />
            </figure>
          </Link>

          {/* ✅ lg Menu */}
          <nav className="hidden lg:flex gap-10">
            {!user && (
              <>
                <Link
                  href="/mover-search"
                  className={linkStyle("/mover-search")}
                >
                  기사님 찾기
                </Link>
              </>
            )}
            {user?.userType === "client" && (
              <>
                <Link href="/request" className={linkStyle("/request")}>
                  견적 요청
                </Link>
                <Link
                  href="/mover-search"
                  className={linkStyle("/mover-search")}
                >
                  기사님 찾기
                </Link>
                <Link href="/my-quotes" className={linkStyle("/my-quotes")}>
                  내 견적 관리
                </Link>
              </>
            )}
            {user?.userType === "mover" && (
              <>
                <Link
                  href="/received-requests"
                  className={linkStyle("/received-requests")}
                >
                  받은 요청
                </Link>
                <Link href="/my-quotes" className={linkStyle("/my-quotes")}>
                  내 견적 관리
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex gap-6">
          {/* ✅ 알림 아이콘 : 아직 설정 안 함 */}
          {user && (
            <figure className={iconStyle}>
              <Image src={alarmIcon} alt="알림 아이콘" fill />
            </figure>
          )}

          {/* ✅ 프로필 + dropdownMenu */}
          <HeaderProfile />

          {/* ✅ sm, md Menu 버튼 */}
          <figure
            onClick={onToggleMenu}
            className="relative w-6 h-6 cursor-pointer lg:hidden"
          >
            <Image src={menuIcon} alt="메뉴 아이콘" fill />
          </figure>

          {/* ✅ 로그인 버튼 */}
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
