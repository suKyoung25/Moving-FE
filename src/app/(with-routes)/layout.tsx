"use client";

import HeaderUI from "@/components/layout/header/HeaderUI";
import HeaderSideBarMenu from "@/components/layout/header/HeaderSideBarMenu";
import { AuthProvider } from "@/context/AuthContext";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 헤더 모바일 메뉴

  return (
    <>
      <AuthProvider>
        <HeaderUI onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} />

        <main className="max-w-[1400px] mx-auto px-6 py-6 md:px-16 lg:px-0 lg:py-10">
          {children}
        </main>
        {isMenuOpen && (
          <HeaderSideBarMenu onClick={() => setIsMenuOpen(false)} />
        )}
      </AuthProvider>
    </>
  );
}
