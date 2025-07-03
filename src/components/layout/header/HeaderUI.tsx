"use client";

import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import menuIcon from "@/assets/images/menuGrayIcon.svg";
import alarmIcon from "@/assets/images/alarmIcon.svg";
import profileIcon from "@/assets/images/profileIcon.svg";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

interface Prop {
  onToggleMenu: () => void;
}

// 스타일 모음
const defaultLinkStyle =
  "text-18-bold flex gap-10 hover:text-black-400 active:text-black-400";
const iconStyle = "relative w-6 h-6 cursor-pointer";

export default function HeaderUI({ onToggleMenu }: Prop) {
  const { user, logout } = useAuth(); // 이용자 정보
  const pathname = usePathname(); // 현재 경로 받기 (링크 색상)

  const linkStyle = (href: string) => {
    const cleanPathname = pathname.replace(/\/$/, "");
    const cleanHref = href.replace(/\/$/, "");

    console.log("pathname:", pathname, "href:", href);
    return cleanPathname.startsWith(cleanHref)
      ? `${defaultLinkStyle} text-black-400`
      : `${defaultLinkStyle} text-gray-400`;
  };

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
                  내 견적 찾기
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
          {/* 알림 아이콘 : 아직 설정 안 함 */}
          {user && (
            <figure className={iconStyle}>
              <Image src={alarmIcon} alt="알림 아이콘" fill />
            </figure>
          )}

          {/* 프로필 아이콘 */}
          <Link href="/profile">
            {user?.profile ? (
              <div className="flex gap-4">
                <figure className={`${iconStyle} rounded-full overflow-hidden`}>
                  <Image
                    src={user.profile}
                    alt="프로필 아이콘"
                    fill
                    className="object-cover"
                  />
                </figure>
                <span className="text-black-400 text-18-medium hidden lg:inline-block">
                  {user.nickname}
                </span>
              </div>
            ) : (
              <figure className={iconStyle}>
                <Image src={profileIcon} alt="프로필 아이콘" fill />
              </figure>
            )}
          </Link>

          {/* sm, md Menu 버튼 */}
          <figure onClick={onToggleMenu} className={`${iconStyle} lg:hidden`}>
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
