import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import menu from "@/assets/images/menuGrayIcon.svg";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 left-0 z-50 bg-white border-b border-line-100">
      <div
        className="
            flex items-center justify-between
            max-w-[1400px] h-14 mx-auto px-6 
            md:px-16 
            lg:px-0 lg:h-20
            "
      >
        <div className="flex items-center gap-20">
          {/* 로고 */}
          <figure
            className="
            relative
            w-[88px] lg:w-[116px] h-[34px] lg:h-[44px]"
          >
            <Image src={logo} alt="무빙 로고" fill />
          </figure>

          {/* 메뉴: lg */}
          <nav>
            <ul className="text-black-400 text-18-bold flex gap-10"></ul>
          </nav>
        </div>

        {/* sm, md */}
        <figure className="relative w-[24px] h-[24px] lg:hidden">
          <Image src={menu} alt="메뉴 아이콘" fill />
        </figure>

        {/* 로그인 버튼 */}
        <Link href="/sign-in/client">
          <button
            className="
                hidden lg:flex w-[116px] h-[44px]
                justify-center items-center
                bg-primary-blue-300 hover:bg-primary-blue-200 rounded-2xl
                text-white text-18-semibold
            "
          >
            로그인
          </button>
        </Link>
      </div>
    </header>
  );
}
