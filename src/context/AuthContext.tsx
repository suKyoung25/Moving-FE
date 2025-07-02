"use client";

import { UserType, User } from "@/types/auth.type";
import { createContext, ReactNode, useContext, useState } from "react";

// ✅ type 등
interface AuthContextType {
  userType: UserType;
  user: User | null;
  loginAsClient: () => void;
  loginAsMover: () => void;
  logout: () => void;
}

//  context 생성
const AuthContext = createContext<AuthContextType | null>(null);

// ✅ context 값 설정
export function AuthProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>("guest"); // 이용자 종류
  const [user, setUser] = useState<User | null>(null); // 이용자 정보

  // ★ 로그인 함수 목록
  const loginAsClient = () => {
    setUserType("client");
    setUser({
      id: "1",
      email: "client@example.com",
      nickname: "일반 사용자",
    });
  };

  const loginAsMover = () => {
    setUserType("mover");
    setUser({
      id: "2",
      email: "mover@example.com",
      nickname: "기사님",
    });
  };

  const logout = () => {
    setUserType("guest");
    setUser(null);
  };

  // 반환
  const value: AuthContextType = {
    userType,
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
