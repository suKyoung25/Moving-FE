"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function HeaderSideBarMenu() {
  const { user } = useAuth();

  return (
    <div className="min-w-full min-h-screen bg">
      <nav className="lg:hidden ablolute min-h-full w-55 bg-gray-50">
        {!user && (
          <>
            <Link
              href="/mover-search"
              className="text-black-400 text-18-bold flex gap-10"
            >
              기사님 찾기
            </Link>
            <Link
              href="/sign-in/client"
              className="text-black-400 text-18-bold flex gap-10"
            >
              로그인
            </Link>
          </>
        )}
        {user?.userType === "client" && (
          <>
            <Link href="" className="text-black-400 text-18-bold flex gap-10">
              견적 요청
            </Link>
            <Link
              href="/mover-search"
              className="text-black-400 text-18-bold flex gap-10"
            >
              기사님 찾기
            </Link>
            <Link href="" className="text-black-400 text-18-bold flex gap-10">
              내 견적 찾기
            </Link>
          </>
        )}
        {user?.userType === "mover" && (
          <>
            <Link href="" className="text-black-400 text-18-bold flex gap-10">
              받은 요청
            </Link>
            <Link href="" className="text-black-400 text-18-bold flex gap-10">
              내 견적 관리
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
