"use client";

import HeaderUI from "@/components/layout/header/HeaderUI";
import HeaderSideBarMenu from "@/components/layout/header/HeaderSideBarMenu";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 헤더 모바일 메뉴

  return (
    <>
      <HeaderUI onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
      {isMenuOpen && <HeaderSideBarMenu onClick={() => setIsMenuOpen(false)} />}
    </>
  );
}
