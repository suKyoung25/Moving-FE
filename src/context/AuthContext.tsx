"use client";

import { User } from "@/types/auth.type";
import { createContext, ReactNode, useContext, useState } from "react";

// ✅ type 등
interface AuthContextType {
  user: User | null;
  loginAsClient: () => void;
  loginAsMover: () => void;
  logout: () => void;
}

//  context 생성
const AuthContext = createContext<AuthContextType | null>(null);

// ✅ context 값 설정
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    userType: "client",
    id: "1",
    email: "client@example.com",
    nickname: "일반 사용자",
    profile:
      "https://i.namu.wiki/i/prFwl-7kmWl-kONk_w3eAyOt_ENdI9yv3cttWzACi68m_dEM53O2IZBPBHln6Qn3ba7D8-Tx32b8chFVV4CV2w.webp",
  }); // 이용자 정보

  // ★ 로그인 함수 목록
  const loginAsClient = () => {
    setUser({
      userType: "client",
      id: "1",
      email: "client@example.com",
      nickname: "일반 사용자",
      profile:
        "https://i.namu.wiki/i/prFwl-7kmWl-kONk_w3eAyOt_ENdI9yv3cttWzACi68m_dEM53O2IZBPBHln6Qn3ba7D8-Tx32b8chFVV4CV2w.webp",
    });
  };

  const loginAsMover = () => {
    setUser({
      userType: "mover",
      id: "2",
      email: "mover@example.com",
      nickname: "기사님",
    });
  };

  const logout = () => {
    setUser(null);
  };

  // 반환
  const value: AuthContextType = {
    user,
    loginAsClient,
    loginAsMover,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ context 값 불러옴
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("AuthProvider 안에서만 useAuth를 사용할 수 있습니다.");

  return context;
}
