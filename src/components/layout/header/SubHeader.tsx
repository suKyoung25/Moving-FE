import React from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import subMenu from "@/lib/utils/subheader-menu.util";
import Link from "next/link";

export default function SubHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return;

  // ✅ subheader-menu.util.ts에서 하위 메뉴 가져오기
  const key = `${user.userType}#${pathname.split("/").slice(0, 3).join("/")}`;
  const menu = subMenu[key];

  if (!menu) return;

  // ✅ 본문
  return (
    <header className="sticky top-0 left-0 z-20 bg-white border-b border-line-200">
      <ul
        className="
            flex items-center mx-auto gap-6 lg:gap-8
            max-w-[1400px] h-14 lg:h-20 px-6 md:px-16 lg:px-0
            "
      >
        {menu.map((list) => {
          const isActive = pathname === list.path;

          return (
            <li
              key={list.label}
              className={`h-full flex items-center
                ${isActive ? "border-b-2" : "pb-0.5"}`}
            >
              <Link
                href={list.path}
                className={
                  isActive
                    ? "text-14-bold lg:text-20-bold text-black-400"
                    : "text-14-medium lg:text-20-medium text-gray-400 hover:text-black-400 hover:font-bold"
                }
              >
                {list.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </header>
  );
}
